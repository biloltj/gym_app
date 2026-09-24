import type { Locale } from "./i18n/locales";

export type Category = "legs" | "chest" | "back" | "arms" | "core" | "cardio";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type AnimationType = "bounce" | "press" | "curl" | "pulse" | "swing" | "shimmer";

export type Exercise = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  animation: AnimationType;
  name: Record<Locale, string>;
  instructions: Record<Locale, string>;
};

export const EXERCISES: Exercise[] = [
  {
    id: "squat",
    category: "legs",
    difficulty: "beginner",
    animation: "bounce",
    name: { en: "Squat", ru: "Приседания", tg: "Нишастан" },
    instructions: {
      en: "Feet shoulder-width apart, lower hips back and down, keep chest up, drive through heels.",
      ru: "Ноги на ширине плеч, опускайте таз назад и вниз, грудь вверх, вставайте через пятки.",
      tg: "Пойҳо ба паҳнои китф, тахтапушт ба ақиб ва поён нишонед, синаро боло нигоҳ доред.",
    },
  },
  {
    id: "lunge",
    category: "legs",
    difficulty: "beginner",
    animation: "swing",
    name: { en: "Lunge", ru: "Выпады", tg: "Қадами дароз" },
    instructions: {
      en: "Step forward, lower until both knees are near 90 degrees, push back to start. Alternate legs.",
      ru: "Шагните вперёд, опуститесь до угла ~90° в обоих коленях, вернитесь. Меняйте ноги.",
      tg: "Пеш қадам занед, то зонуҳо тақрибан 90 дараҷа хам шаванд, баргардед. Пойҳоро иваз кунед.",
    },
  },
  {
    id: "calf-raise",
    category: "legs",
    difficulty: "beginner",
    animation: "bounce",
    name: { en: "Calf raise", ru: "Подъём на носки", tg: "Бардоштани пошна" },
    instructions: {
      en: "Rise onto the balls of your feet, pause, lower slowly. Hold a wall for balance if needed.",
      ru: "Поднимитесь на носки, задержитесь, медленно опуститесь. При необходимости держитесь за опору.",
      tg: "Ба нӯги пой бархезед, каме исто, оҳиста фуроред. Агар лозим бошад, ба девор такя кунед.",
    },
  },
  {
    id: "push-up",
    category: "chest",
    difficulty: "intermediate",
    animation: "press",
    name: { en: "Push-up", ru: "Отжимания", tg: "Такягоҳ" },
    instructions: {
      en: "Hands under shoulders, body in a straight line, lower chest to the floor, press back up.",
      ru: "Руки под плечами, тело прямое, опустите грудь к полу, вернитесь вверх.",
      tg: "Дастҳо зери китф, бадан рост, синаро ба замин наздик кунед, боз бархезед.",
    },
  },
  {
    id: "incline-push-up",
    category: "chest",
    difficulty: "beginner",
    animation: "press",
    name: { en: "Incline push-up", ru: "Отжимания с упором", tg: "Такягоҳи баланд" },
    instructions: {
      en: "Hands on a bench or step, body straight, lower and press back up. Easier than a floor push-up.",
      ru: "Руки на скамье, тело прямое, опуститесь и отожмитесь. Легче обычных отжиманий.",
      tg: "Дастҳо болои курсӣ, бадан рост, поён фаред ва бархезед. Аз такягоҳи оддӣ осонтар.",
    },
  },
  {
    id: "chest-fly",
    category: "chest",
    difficulty: "intermediate",
    animation: "swing",
    name: { en: "Chest fly", ru: "Разведение рук", tg: "Кушодани дастҳо" },
    instructions: {
      en: "Arms slightly bent, open wide to the sides, then bring together in front of the chest.",
      ru: "Руки чуть согнуты, разведите широко в стороны, затем сведите перед грудью.",
      tg: "Дастҳо каме хам, ба паҳлуҳо васеъ кушоед, пас дар пеши сина ҷамъ кунед.",
    },
  },
  {
    id: "superman",
    category: "back",
    difficulty: "beginner",
    animation: "pulse",
    name: { en: "Superman hold", ru: "Супермен", tg: "Нигоҳдории «Супермен»" },
    instructions: {
      en: "Lie face down, lift arms and legs off the floor together, hold, then lower with control.",
      ru: "Лягте на живот, одновременно поднимите руки и ноги, удержите, плавно опуститесь.",
      tg: "Рӯй ба замин хобед, дастону пойҳоро якбора бардоред, каме нигоҳ доред, оҳиста поён фаред.",
    },
  },
  {
    id: "row",
    category: "back",
    difficulty: "intermediate",
    animation: "curl",
    name: { en: "Bent-over row", ru: "Тяга в наклоне", tg: "Кашиши хамида" },
    instructions: {
      en: "Hinge at the hips, back flat, pull elbows back to bring weight toward your ribs.",
      ru: "Наклонитесь, спина прямая, тяните локти назад, поднося вес к рёбрам.",
      tg: "Тахтапуштро хам кунед, пушт рост, оринҷҳоро ба ақиб кашед.",
    },
  },
  {
    id: "reverse-snow-angel",
    category: "back",
    difficulty: "beginner",
    animation: "swing",
    name: { en: "Reverse snow angel", ru: "Обратный снежный ангел", tg: "Фариштаи барфии баръакс" },
    instructions: {
      en: "Lie face down, sweep arms from your sides up overhead and back, squeezing shoulder blades.",
      ru: "Лягте на живот, разведите руки от бёдер вверх над головой, сводя лопатки.",
      tg: "Рӯй ба замин хобед, дастҳоро аз паҳлу то боло ҳаракат диҳед, китфҳоро фишор диҳед.",
    },
  },
  {
    id: "bicep-curl",
    category: "arms",
    difficulty: "beginner",
    animation: "curl",
    name: { en: "Bicep curl", ru: "Сгибание рук на бицепс", tg: "Хамкунии бисепс" },
    instructions: {
      en: "Elbows at your sides, curl the weight up toward your shoulders, lower with control.",
      ru: "Локти прижаты к телу, поднимайте вес к плечам, опускайте медленно.",
      tg: "Оринҷҳо ба тан наздик, вазнро ба тарафи китф бардоред, оҳиста поён фаред.",
    },
  },
  {
    id: "tricep-dip",
    category: "arms",
    difficulty: "intermediate",
    animation: "press",
    name: { en: "Tricep dip", ru: "Отжимания на трицепс", tg: "Такягоҳи трисепс" },
    instructions: {
      en: "Hands on a bench behind you, lower your body by bending elbows, press back up.",
      ru: "Руки на скамье сзади, опускайтесь, сгибая локти, отжимайтесь обратно.",
      tg: "Дастҳо дар курсии қафо, бо хамкунии оринҷ поён фаред, боз бархезед.",
    },
  },
  {
    id: "shoulder-press",
    category: "arms",
    difficulty: "intermediate",
    animation: "press",
    name: { en: "Shoulder press", ru: "Жим над головой", tg: "Фишор аз болои сар" },
    instructions: {
      en: "Start with weights at shoulder height, press straight overhead, lower with control.",
      ru: "Начните с веса на уровне плеч, выжмите вверх, опустите медленно.",
      tg: "Аз сатҳи китф оғоз кунед, рост ба боло фишор диҳед, оҳиста поён фаред.",
    },
  },
  {
    id: "plank",
    category: "core",
    difficulty: "beginner",
    animation: "pulse",
    name: { en: "Plank", ru: "Планка", tg: "Планк" },
    instructions: {
      en: "Forearms and toes on the floor, body in a straight line, brace your core, hold.",
      ru: "Предплечья и носки на полу, тело прямое, напрягите пресс, удерживайте позицию.",
      tg: "Оринҷ ва нӯги пой ба замин, бадан рост, шикамро сахт нигоҳ доред.",
    },
  },
  {
    id: "crunch",
    category: "core",
    difficulty: "beginner",
    animation: "bounce",
    name: { en: "Crunch", ru: "Скручивания", tg: "Печондан" },
    instructions: {
      en: "Knees bent, hands behind your head, lift shoulder blades off the floor, lower slowly.",
      ru: "Колени согнуты, руки за головой, поднимите лопатки от пола, опуститесь медленно.",
      tg: "Зонуҳо хам, дастҳо паси сар, китфҳоро аз замин бардоред, оҳиста поён фаред.",
    },
  },
  {
    id: "russian-twist",
    category: "core",
    difficulty: "intermediate",
    animation: "swing",
    name: { en: "Russian twist", ru: "Русский твист", tg: "Гардиши тан" },
    instructions: {
      en: "Sit leaning back slightly, feet lifted, rotate your torso side to side.",
      ru: "Сидя, слегка откиньтесь назад, ноги приподняты, поворачивайте корпус в стороны.",
      tg: "Нишаста каме ба ақиб хам шавед, пойҳо болобаред, тана ба паҳлуҳо гардонед.",
    },
  },
  {
    id: "jumping-jacks",
    category: "cardio",
    difficulty: "beginner",
    animation: "shimmer",
    name: { en: "Jumping jacks", ru: "Прыжки \"звёздочка\"", tg: "Ҷаҳиши ситора" },
    instructions: {
      en: "Jump feet apart while raising arms overhead, then jump back to start. Keep a steady rhythm.",
      ru: "Прыжком разведите ноги и поднимите руки над головой, вернитесь. Держите ритм.",
      tg: "Бо ҷаҳиш пойҳоро кушоед ва дастҳоро боло баред, баргардед. Суръатро нигоҳ доред.",
    },
  },
  {
    id: "high-knees",
    category: "cardio",
    difficulty: "beginner",
    animation: "bounce",
    name: { en: "High knees", ru: "Бег с высоким подниманием бедра", tg: "Давидан бо зону баланд" },
    instructions: {
      en: "Jog in place, driving knees up toward your chest as fast as you can with good form.",
      ru: "Бег на месте, поднимая колени к груди как можно быстрее, сохраняя технику.",
      tg: "Дар ҷой давед, зонуҳоро тезтар ба тарафи сина боло баред.",
    },
  },
  {
    id: "burpee",
    category: "cardio",
    difficulty: "advanced",
    animation: "shimmer",
    name: { en: "Burpee", ru: "Бёрпи", tg: "Бёрпи" },
    instructions: {
      en: "Squat, kick feet back to a plank, push-up, jump feet in, then jump straight up.",
      ru: "Присед, прыжком в планку, отжимание, прыжком вернуть ноги, прыжок вверх.",
      tg: "Нишинед, пойҳоро ба планк партоед, такягоҳ кунед, баргардед, ба боло ҷаҳед.",
    },
  },
];

export function getCategories(): Category[] {
  return ["legs", "chest", "back", "arms", "core", "cardio"];
}
