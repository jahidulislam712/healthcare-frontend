"use client";

import { TrendingUp } from "lucide-react";
import {
  LabelList,
  Pie,
  PieChart,
  PieSectorShapeProps,
  Sector,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  PAID: {
    label: "Paid",
    color: "var(--chart-1)",
  },
  UNPAID: {
    label: "Unpaid",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type AppointmentData = {
  paymentStatus: "PAID" | "UNPAID";
  count: number;
};

type AppointmentPieChartProps = {
  chartData: AppointmentData[];
  title?: string;
  description?:string;
};

export function AppointmentPieChart({ chartData, title, description }: AppointmentPieChartProps) {
  const CustomPieShape = (props: PieSectorShapeProps) => {
    const color =
      props.payload.paymentStatus === "PAID"
        ? "var(--color-PAID)"
        : "var(--color-UNPAID)";

    return <Sector {...props} fill={color} />;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-75"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="paymentStatus"
              shape={CustomPieShape}
            >
              <LabelList
                dataKey="paymentStatus"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) =>(
                  `${chartConfig[value as keyof typeof chartConfig]?.label}`
                )}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
