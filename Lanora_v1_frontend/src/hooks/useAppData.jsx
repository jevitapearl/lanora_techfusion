import { useState, useEffect } from "react";

export function useAppData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [dashboardRes, sandboxesRes, historyRes, resourceRes] =
          await Promise.all([
            fetch("http://localhost:8080/api/dashboard"),
            fetch("http://localhost:8080/api/sandboxes"),
            fetch("http://localhost:8080/api/history"),
            fetch("http://localhost:8080/api/resources"),
          ]);

        const dashboard = await dashboardRes.json();
        const sandboxes = await sandboxesRes.json();
        const history = await historyRes.json();
        const resources = await resourceRes.json();

        const formattedData = {
          dashboard: {
            stats: {
              sandboxes: json.active_sandboxes,
              runtime: json.total_runtime,
              agents: json.active_agents,
            },
            recentTests: [],
            storage: "--",
            files: "--",
          },
          sandboxes: {
            stats: {
              created: sandboxes.length,
              runtime: sandboxes.reduce((sum, s) => sum + s.runtime, 0),
              storage: sandboxes.reduce((sum, s) => sum + s.storage, 0)
            },
            history: sandboxes
          },

          resourceUsage: {
            stats: [
              { title: "Memory Usage", value: `${resources.memory_mb} MB` },
              { title: "Active Runtime", value: `${resources.runtime}s` },
              { title: "Tokens Used", value: resources.tokens },
              { title: "GPU Usage", value: `${resources.gpu}%` }
            ]
          },

          testHistory: {
            tests: history
          }
        };

        console.log("Mapped Data:", formattedData);
        setData(formattedData);
      } catch (err) {
        console.error(err);
        setError("Cannot connect to backend");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { data, loading, error };
}
