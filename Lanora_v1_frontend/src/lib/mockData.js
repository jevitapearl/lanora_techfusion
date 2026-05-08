export const mockData = {
  dashboard: {
    stats: {
      sandboxes: 8,
      runtime: "25:52:21",
      agents: 5
    },
    recentTests: [
      {
        id: 1,
        agent: "agent1.py",
        status: "Running",
        createdAt: "19/02/2026 19:20:00",
        runtime: "02m 14s"
      },
      {
        id: 2,
        agent: "agent2.py",
        status: "Terminated",
        createdAt: "19/02/2026 19:20:00",
        runtime: "10m 05s"
      }
    ],
    storage: "34 GB",
    files: 24
  },

  testHistory: {
    tests: [
      {
        id: 1,
        agent: "agent1.py",
        status: "Running",
        createdAt: "19/02/2026",
        runtime: "19:20:00"
      },
      {
        id: 2,
        agent: "agent2.py",
        status: "Terminated",
        createdAt: "19/02/2026",
        runtime: "05:12:44"
      },
      {
        id: 3,
        agent: "data-pipeline.py",
        status: "Success",
        createdAt: "18/02/2026",
        runtime: "00:45:10"
      },
      {
        id: 4,
        agent: "code-assistant.py",
        status: "Error",
        createdAt: "17/02/2026",
        runtime: "00:03:15"
      },
      {
        id: 5,
        agent: "research-node.js",
        status: "Success",
        createdAt: "15/02/2026",
        runtime: "01:10:00"
      }
    ]
  },

  resourceUsage: {
    stats: [
      { title: "Memory Usage", value: "RAM: 180 MB" },
      { title: "Active Runtime", value: "21:21:51" },
      { title: "Tokens Used", value: "65%" },
      { title: "GPU Usage", value: "25%" }
    ]
  },

  sandboxes: {
    stats: {
      created: 12,
      runtime: "21:21:51",
      storage: "24 GB"
    },
    history: [
      {
        id: 1,
        name: "sb_2344.py",
        status: "Running",
        started: "12:21:02",
        duration: "03:23:02"
      }
    ]
  }
};
