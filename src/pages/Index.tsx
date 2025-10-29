import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Bell, Users, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Beautiful charts and insights into your spending patterns",
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Your expenses update instantly across all devices",
    },
    {
      icon: Users,
      title: "Collaboration Ready",
      description: "Share budgets and track expenses with your team",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified about budget limits and spending trends",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Cloud-Based Expense Tracking
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track expenses, visualize spending, and collaborate on budgets in real-time.
              Your complete financial management solution in the cloud.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/auth")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground">
            Powerful features to manage your expenses effortlessly
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold text-primary-foreground">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of users managing their expenses smarter with ExpenseCloud
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 shadow-xl"
              onClick={() => navigate("/auth")}
            >
              Start Tracking Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
