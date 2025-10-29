import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface ExpenseChartsProps {
  userId: string;
}

const COLORS = [
  "hsl(195, 100%, 39%)",
  "hsl(220, 70%, 50%)",
  "hsl(160, 84%, 39%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
  "hsl(280, 70%, 50%)",
  "hsl(140, 60%, 45%)",
  "hsl(25, 85%, 55%)",
];

export const ExpenseCharts = ({ userId }: ExpenseChartsProps) => {
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId);

      if (!expenses) return;

      // Category breakdown
      const categoryTotals: Record<string, number> = {};
      expenses.forEach((expense) => {
        categoryTotals[expense.category] =
          (categoryTotals[expense.category] || 0) + Number(expense.amount);
      });

      const catData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
      }));
      setCategoryData(catData);

      // Timeline data (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      const timeData = last7Days.map((date) => {
        const dayExpenses = expenses.filter((e) => e.expense_date === date);
        const total = dayExpenses.reduce(
          (sum, e) => sum + Number(e.amount),
          0
        );
        return {
          date: new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          amount: total,
        };
      });
      setTimelineData(timeData);
    };

    fetchData();

    const channel = supabase
      .channel("expenses-chart-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No data to display
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(195, 100%, 39%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(195, 100%, 39%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No data to display
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};