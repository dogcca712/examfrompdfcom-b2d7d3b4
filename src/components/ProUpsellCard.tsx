import { Crown, Sparkles, FileStack, SlidersHorizontal, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const proFeatures = [
  {
    icon: SlidersHorizontal,
    title: "调整题目难度",
    description: "从简单到困难，完全掌控试卷难度",
  },
  {
    icon: Sparkles,
    title: "调整题目数量",
    description: "自定义选择题、简答题、论述题数量",
  },
  {
    icon: FileStack,
    title: "多文件综合出题",
    description: "上传整学期的讲义，生成综合期末试卷",
  },
];

export function ProUpsellCard() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="mt-8 animate-slide-up rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 shadow-xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
          <Crown className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">升级到 Pro</h3>
          <p className="text-sm text-muted-foreground">解锁全部高级功能</p>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6 space-y-4">
        {proFeatures.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {isAuthenticated ? (
          <Button asChild size="lg" variant="gradient" className="flex-1">
            <Link to="/pricing">
              <Zap className="mr-2 h-4 w-4" />
              查看 Pro 方案
            </Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg" variant="gradient" className="flex-1">
              <Link to="/register">
                <Zap className="mr-2 h-4 w-4" />
                免费注册并升级
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link to="/login">已有账号？登录</Link>
            </Button>
          </>
        )}
      </div>

      {/* Trust badge */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        🎓 已有超过 10,000 名学生使用 ExamGen 备考
      </p>
    </div>
  );
}
