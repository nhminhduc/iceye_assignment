import React, { useMemo, useState, useEffect } from "react";
import { Card, Spin, DatePicker, Space, Button, Table } from "antd";
import { useAtom } from "jotai";
import { acquisitionsAtom } from "@/store/acquisitionsAtoms";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

interface DataPoint {
  timestamp: number;
  ore_sites: number;
}

const AcquisitionsChart: React.FC = () => {
  const [{ data = [], isLoading }] = useAtom(acquisitionsAtom);
  const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs(), dayjs()]);

  const fullData = useMemo(
    () =>
      data
        .map((pt: DataPoint) => ({
          date: dayjs.unix(pt.timestamp).format("YYYY-MM-DD"),
          sites: pt.ore_sites,
          ts: pt.timestamp,
        }))
        .sort((a, b) => a.ts - b.ts),
    [data]
  );

  useEffect(() => {
    if (fullData.length) {
      setRange([
        dayjs.unix(fullData[0].ts),
        dayjs.unix(fullData[fullData.length - 1].ts),
      ]);
    }
  }, [fullData]);

  const [slice, setSlice] = useState(fullData);

  useEffect(() => {
    const [start, end] = range;
    setSlice(
      fullData.filter((pt) => dayjs(pt.date).isBetween(start, end, null, "[]"))
    );
  }, [fullData, range]);

  const [view, setView] = useState<"chart" | "table">("chart");

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Detected Sites", dataIndex: "sites", key: "sites" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin tip="Loading data..." />
      </div>
    );
  }

  return (
    <Card
      title="Detected Sites Over Time"
      extra={
        <Space>
          <RangePicker
            value={range}
            onChange={(vals) => {
              if (vals && vals.length === 2 && vals[0] && vals[1]) {
                setRange([vals[0], vals[1]]);
              }
            }}
            allowClear={false}
            format="YYYY-MM-DD"
          />
          <Button.Group size="small">
            <Button
              type={view === "chart" ? "primary" : "default"}
              onClick={() => setView("chart")}
            >
              Chart
            </Button>
            <Button
              type={view === "table" ? "primary" : "default"}
              onClick={() => setView("table")}
            >
              Table
            </Button>
          </Button.Group>
        </Space>
      }
      className="w-full bg-white dark:bg-gray-800 shadow-sm"
    >
      {view === "chart" ? (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={slice} data-testid="linechart">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fill: "currentColor" }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval="preserveStartEnd"
              />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sites"
                stroke="#1890ff"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                name="Detected Sites"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={slice.map((pt) => ({
              key: pt.ts,
              date: pt.date,
              sites: pt.sites,
            }))}
            pagination={{ pageSize: 10, showSizeChanger: true }}
          />
        </div>
      )}
    </Card>
  );
};

export default AcquisitionsChart;
