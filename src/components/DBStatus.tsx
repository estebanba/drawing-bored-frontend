import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export function DBStatus() {
  const [mongo, setMongo] = useState<string | null>(null);
  const [mysql, setMysql] = useState<string | null>(null);

  const checkConnections = async () => {
    try {
      const mongoRes = await axios.get("/mongo/test-connection");
      setMongo(mongoRes.data.ok ? `OK (users: ${mongoRes.data.count})` : "Fail");
    } catch {
      setMongo("Fail");
    }
    try {
      const mysqlRes = await axios.get("/mysql/test-connection");
      setMysql(mysqlRes.data.ok ? `OK (users: ${mysqlRes.data.count})` : "Fail");
    } catch {
      setMysql("Fail");
    }
  };

  return (
    <div>
      <Button onClick={checkConnections} className="mb-2">Test DB Connections</Button>
      <div>MongoDB: {mongo}</div>
      <div>MySQL: {mysql}</div>
    </div>
  );
} 