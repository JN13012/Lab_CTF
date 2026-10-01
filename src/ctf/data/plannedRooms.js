// Rooms announced in a curriculum but not playable yet. They render like
// regular rooms with a "Coming soon" status and are never counted as solved.
export const plannedRooms = [
  {
    id: "ai-how-machines-learn",
    title: "How Machines Learn",
    difficulty: "Intro",
    objective: "Tell narrow AI, machine learning and deep learning apart, and see how a model learns from data.",
  },
  {
    id: "ai-neural-networks",
    title: "Inside a Neural Network",
    difficulty: "Intro",
    objective: "Follow data through neurons, layers and weights, then meet CNNs, RNNs and transformers.",
  },
  {
    id: "ai-prompting",
    title: "Prompting Fundamentals",
    difficulty: "Easy",
    objective: "Write prompts with a role, context, constraints and an output format, from zero-shot to few-shot.",
  },
  {
    id: "ai-python-essentials",
    title: "Python Essentials",
    difficulty: "Intro",
    objective: "Variables, data structures, functions and errors: the Python you need before any model.",
  },
  {
    id: "ai-numpy",
    title: "Arrays with NumPy",
    difficulty: "Easy",
    objective: "Create, slice and compute on arrays without loops, the way every ML library expects data.",
  },
  {
    id: "ai-pandas",
    title: "DataFrames with pandas",
    difficulty: "Easy",
    objective: "Load, filter, clean and group tabular data to answer real questions about a dataset.",
  },
  {
    id: "ai-apis",
    title: "Working with APIs",
    difficulty: "Easy",
    objective: "Call a REST API, read its JSON and turn the response into a clean DataFrame.",
  },
  {
    id: "ai-web-scraping",
    title: "Web Scraping",
    difficulty: "Medium",
    objective: "Parse HTML with BeautifulSoup, extract a table from a page and respect scraping etiquette.",
  },
  {
    id: "ai-file-formats",
    title: "File Formats and Cleaning",
    difficulty: "Medium",
    objective: "Read CSV, JSON and XML, fix missing values and wrong types, then plot the result.",
  },
].map((room) => ({ ...room, planned: true }));

export const getPlannedRoomById = (id) => plannedRooms.find((room) => room.id === id);
