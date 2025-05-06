import React, { useState } from "react";
import { Card, Table, Spin, Alert } from "antd";
import { useAtom } from "jotai";
import { acquisitionsAtom } from "@/store/acquisitionsAtoms";

// Type definitions
interface Acquisition {
  timestamp: number;
  ore_sites: number;
}
interface TableData {
  key: number;
  date: string;
  ore_sites: number;
}
interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  sorter?: (a: TableData, b: TableData) => number;
}

const AcquisitionsPanel: React.FC = () => {
  const [{ data = [], isLoading, isError, error }] = useAtom(acquisitionsAtom);
  const [pageSize, setPageSize] = useState<number>(10);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" aria-busy="true">
        <Spin tip="Loading acquisitions…" size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        role="alert"
        message="Failed to load acquisitions"
        description={String(error)}
        className="max-w-xl mx-auto mt-8"
      />
    );
  }

  const tableData: TableData[] = data.map((item: Acquisition) => ({
    key: item.timestamp,
    date: new Date(item.timestamp * 1000).toLocaleDateString(),
    ore_sites: item.ore_sites,
  }));

  const columns: ColumnType[] = [
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Detected Sites",
      dataIndex: "ore_sites",
      key: "ore_sites",
      sorter: (a, b) => a.ore_sites - b.ore_sites,
    },
  ];

  return (
    <section className="flex items-center justify-center bg-gray-100 p-4">
      <Card
        title={
          <h2 className="text-xl font-semibold text-gray-800">
            Satellite Acquisitions (Last Month)
          </h2>
        }
        className="w-full max-w-4xl mx-auto mt-12 shadow-lg"
        aria-label="Satellite acquisitions panel"
      >
        <div className="overflow-x-auto">
          <figure>
            <figcaption className="sr-only">
              Table listing satellite acquisitions in the last month (Date,
              Detected Sites)
            </figcaption>
            <Table
              rowKey="key"
              columns={columns}
              dataSource={tableData}
              pagination={{
                pageSize,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onShowSizeChange: (_current, size) => setPageSize(size),
                className: "flex justify-center py-4",
              }}
              className="min-w-full"
              aria-label="Satellite acquisitions table"
            />
          </figure>
        </div>
      </Card>
    </section>
  );
};

export default AcquisitionsPanel;
