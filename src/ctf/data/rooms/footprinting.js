export const footprinting = {
  id: "footprinting",
  order: 1,
  title: "Premiers Indices",
  category: "Recon",
  difficulty: "Intro",
  flag: "Welcome_User",
  unlocks: [],
  objective:
    "Commencer l'investigation. Le premier flag se trouve dans la surface visible du site.",
  scenario:
    "Bienvenue dans le Cyber Training Lab. Tu demarres comme analyste junior et tu dois apprendre a lire les indices laisses dans l'environnement.",
  hint:
    "Inspecte la source de la page, ou simule-le ici avec les fichiers cachés. Essaie ls -la puis cat .flag.txt.",
  files: {
    "readme.txt":
      "Welcome user. Search, find, and validate. Exit any session before submit flag.",
    ".flag.txt":
      "Did you think it would be that easy? The flag is hidden within the source code. FLAG{Welcome_User}",
  },
};
