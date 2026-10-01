export const roomTasks = {
  footprinting: [
    {
      id: "intro",
      title: "Introduction",
      body: [
        {
          type: "p",
          text: "Every assessment starts with reconnaissance: looking at what a target already exposes before touching anything. Most first clues are not hidden behind exploits, they are simply sitting in places nobody bothered to check.",
        },
        {
          type: "list",
          items: [
            "Read what is visible before guessing",
            "Look for files and comments that were left behind",
            "Write down everything you find",
          ],
        },
      ],
      questions: [{ id: "ready", prompt: "Read the introduction above.", kind: "ack" }],
    },
    {
      id: "hidden-files",
      title: "Hidden files",
      machine: true,
      body: [
        {
          type: "p",
          text: "On Linux, a file whose name starts with a dot is hidden from a plain listing. The ls command only shows them when you ask for all files.",
        },
        { type: "code", text: "$ ls\nreadme.txt\n\n$ ls -la\n.flag.txt\nreadme.txt" },
        {
          type: "note",
          text: "Start the target machine at the top of the room to use the terminal.",
        },
      ],
      questions: [
        {
          id: "ls-option",
          prompt: "Which ls option lists hidden files with details?",
          answer: ["-la", "-al", "la", "al"],
          format: "***",
        },
        {
          id: "hidden-name",
          prompt: "What is the name of the hidden file?",
          answer: [".flag.txt"],
          format: "*********",
        },
      ],
    },
    {
      id: "read",
      title: "Reading the clue",
      machine: true,
      body: [
        {
          type: "p",
          text: "Use cat to print a file's content in the terminal. Read the hidden file and recover the flag it contains.",
        },
        { type: "code", text: "$ cat <filename>" },
      ],
      questions: [{ id: "flag", prompt: "What is the flag?", kind: "flag" }],
    },
  ],

  "linux-commands": [
    {
      id: "orientation",
      title: "Getting your bearings",
      machine: true,
      body: [
        {
          type: "p",
          text: "You land on a staging server full of logs, backups and notes. Before searching for anything, list the directory and read the file that explains the mission.",
        },
        { type: "code", text: "$ ls -la\n$ cat readme.txt" },
      ],
      questions: [
        {
          id: "mission-file",
          prompt: "Which file explains the mission?",
          answer: ["readme.txt"],
          format: "**********",
        },
      ],
    },
    {
      id: "find",
      title: "Finding files by name",
      machine: true,
      body: [
        {
          type: "p",
          text: "When a directory is crowded, search by name instead of opening files one by one. find lists every file whose name matches what you are looking for.",
        },
        { type: "code", text: "$ find backup" },
      ],
      questions: [
        {
          id: "backup-count",
          prompt: "How many backup notes files are on the server?",
          answer: ["2", "two"],
          format: "*",
        },
        {
          id: "index-file",
          prompt: "Which hidden file indexes the backups?",
          answer: [".backup_index.txt"],
          format: "*****************",
        },
      ],
    },
    {
      id: "grep",
      title: "Searching inside files",
      machine: true,
      body: [
        {
          type: "p",
          text: "grep searches inside file contents and prints the matching lines. Use it to isolate the artifact that contains the flag, then read it with cat.",
        },
        { type: "code", text: "$ grep FLAG" },
      ],
      questions: [{ id: "flag", prompt: "What is the flag?", kind: "flag" }],
    },
  ],

  "service-scanning": [
    {
      id: "scan",
      title: "Port scanning",
      machine: true,
      body: [
        {
          type: "p",
          text: "A port scan tells you which services a machine exposes. With version detection, nmap also identifies the software behind each open port, which is where most attack paths begin.",
        },
        { type: "code", text: "$ nmap -sV 10.0.2.15" },
        {
          type: "list",
          items: [
            "-sV asks nmap to detect service versions",
            "Each line of the result is one open port",
          ],
        },
      ],
      questions: [
        {
          id: "open-ports",
          prompt: "How many open ports does the target expose?",
          answer: ["4", "four"],
          format: "*",
        },
        {
          id: "ftp-software",
          prompt: "Which FTP server software runs on port 21?",
          answer: ["vsftpd", "vsftpd 3.0.3"],
          format: "******",
        },
        {
          id: "flask-port",
          prompt: "Which port runs the Flask API?",
          answer: ["5000"],
          format: "****",
        },
      ],
    },
    {
      id: "connect",
      title: "Talking to the service",
      machine: true,
      body: [
        {
          type: "p",
          text: "The Flask API runs in debug mode, which should never be exposed. Connect to it with netcat, list what it offers and read the flag.",
        },
        { type: "code", text: "$ nc 10.0.2.15 <port>" },
      ],
      questions: [{ id: "flag", prompt: "What is the flag?", kind: "flag" }],
    },
  ],
};
