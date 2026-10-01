export const footprinting = {
  id: "footprinting",
  order: 1,
  title: "First Clues",
  category: "Recon",
  difficulty: "Intro",
  flag: "Welcome_User",
  unlocks: [],
  objective:
    "Start the investigation. The first flag is hidden in the visible surface of the site.",
  scenario:
    "Welcome to Cyber Training Lab. You start as a junior analyst and learn to read the clues left in the environment.",
  hint:
    "Inspect the page source, simulated here with hidden files. Try ls -la, then cat .flag.txt.",
  files: {
    "readme.txt":
      "Welcome user. Search, find, and validate. Exit any session before submit flag.",
    ".flag.txt":
      "Did you think it would be that easy? The flag is hidden within the source code. FLAG{Welcome_User}",
  },
};
