import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calendar, PieChart } from "lucide-react";

interface ExpenseSummaryProps {
  userId: string;
}

export const ExpenseSummary = ({ userId }: ExpenseSummaryProps) => {
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    const fetchSummary = async () => {
      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId);

      if (!expenses) return;

      const total = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );
      setTotalSpent(total);
      setExpenseCount(expenses.length);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyTotal = expenses
        .filter((e) => {
          const date = new Date(e.expense_date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, expense) => sum + Number(expense.amount), 0);
      setMonthlySpent(monthlyTotal);

      const categories = new Set(expenses.map((e) => e.category));
      setCategoryCount(categories.size);
    };

    fetchSummary();

    const channel = supabase
      .channel("expenses-summary-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchSummary();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const summaryCards = [
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      title: "This Month",
      value: `$${monthlySpent.toFixed(2)}`,
      icon: Calendar,
      color: "text-secondary",
    },
    {
      title: "Total Expenses",
      value: expenseCount.toString(),
      icon: TrendingUp,
      color: "text-accent",
    },
    {
      title: "Categories",
      value: categoryCount.toString(),
      icon: PieChart,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryCards.map((card) => (
        <Card key={card.title} className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};