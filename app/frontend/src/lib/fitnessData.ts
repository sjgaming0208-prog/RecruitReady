export type Branch = "army" | "navy" | "raf" | "police";

export interface FitnessStandard {
  exercise: string;
  unit: string;
  male: { under30: string; over30: string };
  female: { under30: string; over30: string };
  description: string;
}

export interface TrainingWeek {
  week: number;
  title: string;
  days: { day: string; workout: string; details: string }[];
}

export interface Tip {
  title: string;
  icon: string;
  content: string;
}

export interface BranchInfo {
  id: Branch;
  name: string;
  fullName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  image: string;
  description: string;
  standards: FitnessStandard[];
  trainingPlan: TrainingWeek[];
}

export interface ProgressEntry {
  id: string;
  date: string;
  branch: Branch;
  exercises: { name: string; value: number; unit: string }[];
}

export const BRANCH_IMAGES: Record<Branch, string> = {
  army: "https://mgx-backend-cdn.metadl.com/generate/images/1011331/2026-03-08/84bf25ff-b1b7-42e3-a09c-ea5751e02a5d.png",
  navy: "https://mgx-backend-cdn.metadl.com/generate/images/1011331/2026-03-08/e2e31f60-3da1-4ee4-bbec-0447567d58e0.png",
  raf: "https://mgx-backend-cdn.metadl.com/generate/images/1011331/2026-03-08/c6d3cbf5-be18-48c5-8334-1003ee84a42a.png",
  police: "https://mgx-backend-cdn.metadl.com/generate/images/1011331/2026-03-08/8794ea83-35b0-4864-a0c0-bb6c78468336.png",
};

export const WORKOUT_IMAGES: Record<string, string> = {
  "press-ups": "https://mgx-backend-cdn.metadl.com/generate/images/1011331/2026-03-08/bfb63784-c229-4a4a-8432-0a3e4cd65fcc.png",
  "running": "https://mgx-backend-cdn.metadl.com/generate/images/1011331/2026-03-08/3f981d72-6042-4bce-8670-ff19569caf9b.png",
  "sit-ups": "https://mgx-backend-cdn.metadl.com/generate/images/1011331/2026-03-08/b59d792d-ce6c-4e72-b061-71732bd9aa15.png",
  "bleep-test": "https://mgx-backend-cdn.metadl.com/generate/images/1011331/2026-03-08/a78bb50f-47b6-48b0-a72f-eaecd3d2cca0.png",
};

export const WORKOUT_VIDEOS: Record<string, { url: string; title: string }> = {
  "press-ups": { url: "https://www.youtube.com/watch?v=IODxDxX7oi4", title: "Perfect Press-Up Form" },
  "running": { url: "https://www.youtube.com/watch?v=_kGESn8ArrU", title: "1.5 Mile Run Tips" },
  "sit-ups": { url: "https://www.youtube.com/watch?v=1fbU_MkV7NE", title: "Proper Sit-Up Technique" },
  "bleep-test": { url: "https://www.youtube.com/watch?v=P-f7x3mMk5g", title: "How to Pass the Bleep Test" },
  "mid-thigh-pull": { url: "https://www.youtube.com/watch?v=6TlbDQUWs0s", title: "Mid-Thigh Pull Guide" },
  "push-pull": { url: "https://www.youtube.com/watch?v=IODxDxX7oi4", title: "Push/Pull Training" },
  "grip-strength": { url: "https://www.youtube.com/watch?v=V7Q1dXrMfKg", title: "Grip Strength Training" },
};

export function getWorkoutImage(exerciseName: string): string | null {
  const name = exerciseName.toLowerCase();
  if (name.includes("run") || name.includes("treadmill") || name.includes("mile")) return WORKOUT_IMAGES["running"];
  if (name.includes("press-up") || name.includes("press up") || name.includes("push-up")) return WORKOUT_IMAGES["press-ups"];
  if (name.includes("sit-up") || name.includes("sit up")) return WORKOUT_IMAGES["sit-ups"];
  if (name.includes("bleep") || name.includes("shuttle")) return WORKOUT_IMAGES["bleep-test"];
  return null;
}

export function getWorkoutVideo(exerciseName: string): { url: string; title: string } | null {
  const name = exerciseName.toLowerCase();
  if (name.includes("run") || name.includes("treadmill") || name.includes("mile")) return WORKOUT_VIDEOS["running"];
  if (name.includes("press-up") || name.includes("press up") || name.includes("push-up")) return WORKOUT_VIDEOS["press-ups"];
  if (name.includes("sit-up") || name.includes("sit up")) return WORKOUT_VIDEOS["sit-ups"];
  if (name.includes("bleep") || name.includes("shuttle")) return WORKOUT_VIDEOS["bleep-test"];
  if (name.includes("mid-thigh") || name.includes("pull")) return WORKOUT_VIDEOS["mid-thigh-pull"];
  if (name.includes("push") && name.includes("pull")) return WORKOUT_VIDEOS["push-pull"];
  if (name.includes("grip")) return WORKOUT_VIDEOS["grip-strength"];
  return null;
}

export const branches: BranchInfo[] = [
  {
    id: "army",
    name: "British Army",
    fullName: "British Army",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    image: BRANCH_IMAGES.army,
    description:
      "The Army Fitness Assessment (AFA) tests your strength, endurance and cardiovascular fitness. You must pass the Role Fitness Test (RFT) to begin training.",
    standards: [
      {
        exercise: "1.5 Mile Run",
        unit: "minutes",
        male: { under30: "12:45", over30: "13:15" },
        female: { under30: "14:00", over30: "14:30" },
        description:
          "Run 1.5 miles (2.4km) on a flat course. This is the primary cardiovascular test.",
      },
      {
        exercise: "Press-Ups (2 min)",
        unit: "reps",
        male: { under30: "44", over30: "38" },
        female: { under30: "21", over30: "18" },
        description:
          "Maximum press-ups in 2 minutes with correct form. Chest must touch the ground.",
      },
      {
        exercise: "Sit-Ups (2 min)",
        unit: "reps",
        male: { under30: "50", over30: "43" },
        female: { under30: "50", over30: "43" },
        description:
          "Maximum sit-ups in 2 minutes. Arms crossed on chest, elbows must touch thighs.",
      },
      {
        exercise: "Mid-Thigh Pull",
        unit: "kg",
        male: { under30: "72", over30: "72" },
        female: { under30: "46", over30: "46" },
        description:
          "Isometric strength test. Pull a bar fixed at mid-thigh height with maximum force.",
      },
    ],
    trainingPlan: [
      {
        week: 1,
        title: "Foundation Building",
        days: [
          { day: "Mon", workout: "Easy Run + Core", details: "20 min easy jog at conversational pace. 3x20 sit-ups, 3x15 press-ups, 60s plank." },
          { day: "Tue", workout: "Upper Body Strength", details: "4x12 press-ups, 3x10 diamond press-ups, 3x8 dips, 3x10 burpees." },
          { day: "Wed", workout: "Rest / Light Walk", details: "30 min brisk walk or complete rest. Stretch and foam roll." },
          { day: "Thu", workout: "Interval Run", details: "5 min warm-up, 6x400m at fast pace with 90s rest, 5 min cool-down." },
          { day: "Fri", workout: "Full Body Circuit", details: "3 rounds: 15 press-ups, 20 sit-ups, 10 burpees, 20 squats, 30s plank. 60s rest between rounds." },
          { day: "Sat", workout: "Long Run", details: "30 min steady run. Build endurance at moderate pace." },
          { day: "Sun", workout: "Rest", details: "Full rest day. Hydrate, stretch, prepare for next week." },
        ],
      },
      {
        week: 2,
        title: "Building Endurance",
        days: [
          { day: "Mon", workout: "Tempo Run + Core", details: "25 min run with middle 10 min at tempo pace. 4x20 sit-ups, 4x15 press-ups." },
          { day: "Tue", workout: "Push/Pull Strength", details: "5x15 press-ups, 3x12 inverted rows, 4x10 pike press-ups, 3x15 tricep dips." },
          { day: "Wed", workout: "Active Recovery", details: "20 min swim or cycle. Light stretching session." },
          { day: "Thu", workout: "Hill Sprints", details: "Warm-up 10 min. 8x30s hill sprints with walk-back recovery. Cool-down 5 min." },
          { day: "Fri", workout: "Military Circuit", details: "4 rounds: 20 press-ups, 25 sit-ups, 15 burpees, 25 squats, 45s plank. 45s rest." },
          { day: "Sat", workout: "Long Run", details: "35 min steady run. Aim for consistent pace throughout." },
          { day: "Sun", workout: "Rest", details: "Full rest. Focus on nutrition and sleep." },
        ],
      },
      {
        week: 3,
        title: "Intensity Phase",
        days: [
          { day: "Mon", workout: "Speed Work", details: "Warm-up, 8x200m sprints with 60s rest, 4x400m at 1.5 mile pace with 90s rest." },
          { day: "Tue", workout: "Max Effort Upper Body", details: "Test max press-ups in 2 min. 4x failure press-ups, 4x12 dips, 3x15 sit-ups." },
          { day: "Wed", workout: "Rest / Yoga", details: "Light yoga or stretching. Focus on hip flexors and shoulders." },
          { day: "Thu", workout: "Fartlek Run", details: "30 min fartlek: alternate 2 min fast / 2 min easy. Include 4x30s all-out sprints." },
          { day: "Fri", workout: "Assessment Simulation", details: "Full mock test: max press-ups 2 min, max sit-ups 2 min, 1.5 mile timed run." },
          { day: "Sat", workout: "Recovery Run", details: "25 min very easy jog. Focus on form and breathing." },
          { day: "Sun", workout: "Rest", details: "Full rest. Review progress and adjust targets." },
        ],
      },
      {
        week: 4,
        title: "Peak & Test Week",
        days: [
          { day: "Mon", workout: "Sharpening Run", details: "Warm-up, 4x800m at target 1.5 mile pace with 2 min rest. Cool-down." },
          { day: "Tue", workout: "Light Strength", details: "3x10 press-ups, 3x15 sit-ups, 2x30s plank. Keep volume low." },
          { day: "Wed", workout: "Rest", details: "Complete rest. Hydrate well, eat clean, sleep 8+ hours." },
          { day: "Thu", workout: "Light Jog + Drills", details: "15 min easy jog with strides. Dynamic stretching." },
          { day: "Fri", workout: "REST", details: "Day before test. Rest completely. Prepare kit and nutrition." },
          { day: "Sat", workout: "TEST DAY", details: "Full fitness assessment: press-ups, sit-ups, 1.5 mile run. Give 100%!" },
          { day: "Sun", workout: "Recovery", details: "Light walk, stretch, celebrate your progress!" },
        ],
      },
    ],
  },
  {
    id: "navy",
    name: "Royal Navy",
    fullName: "Royal Navy",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    image: BRANCH_IMAGES.navy,
    description:
      "The Royal Navy Pre-Joining Fitness Test (PJFT) focuses on cardiovascular endurance. You'll need to pass a treadmill run at your local gym before attending HMS Raleigh.",
    standards: [
      {
        exercise: "2.4km Treadmill Run",
        unit: "minutes",
        male: { under30: "12:20", over30: "13:10" },
        female: { under30: "14:35", over30: "15:20" },
        description:
          "Run 2.4km on a treadmill set to 2% incline. This simulates outdoor running conditions.",
      },
      {
        exercise: "Press-Ups",
        unit: "reps",
        male: { under30: "23", over30: "17" },
        female: { under30: "17", over30: "12" },
        description:
          "Continuous press-ups without rest. Maintain proper form throughout.",
      },
      {
        exercise: "Sit-Ups",
        unit: "reps",
        male: { under30: "39", over30: "32" },
        female: { under30: "29", over30: "22" },
        description:
          "Sit-ups performed in correct form. Hands on temples, elbows to knees.",
      },
      {
        exercise: "Bleep Test",
        unit: "level",
        male: { under30: "9.10", over30: "8.8" },
        female: { under30: "7.2", over30: "6.8" },
        description:
          "Multi-stage fitness test (bleep test). Run 20m shuttles in time with beeps.",
      },
    ],
    trainingPlan: [
      {
        week: 1,
        title: "Cardio Foundation",
        days: [
          { day: "Mon", workout: "Steady Run", details: "25 min easy run on treadmill at 2% incline. Build base fitness." },
          { day: "Tue", workout: "Swimming + Press-Ups", details: "20 min swim (any stroke). 3x15 press-ups, 3x20 sit-ups." },
          { day: "Wed", workout: "Rest", details: "Complete rest or light stretching." },
          { day: "Thu", workout: "Interval Training", details: "Treadmill: 5 min warm-up, 8x1 min fast / 1 min slow, 5 min cool-down." },
          { day: "Fri", workout: "Circuit Training", details: "3 rounds: 15 press-ups, 20 sit-ups, 20 squats, 10 burpees, 30s plank." },
          { day: "Sat", workout: "Long Run", details: "35 min steady run outdoors. Focus on maintaining pace." },
          { day: "Sun", workout: "Rest", details: "Full rest day." },
        ],
      },
      {
        week: 2,
        title: "Building Power",
        days: [
          { day: "Mon", workout: "Tempo Run", details: "30 min run: 10 min easy, 10 min tempo, 10 min easy." },
          { day: "Tue", workout: "Upper Body Focus", details: "5x12 press-ups, 3x10 diamond press-ups, 4x15 sit-ups, 3x10 burpees." },
          { day: "Wed", workout: "Swim Session", details: "30 min swim mixing strokes. Focus on endurance." },
          { day: "Thu", workout: "Bleep Test Practice", details: "Practice bleep test to current max. Rest 5 min. Repeat x2." },
          { day: "Fri", workout: "Strength Circuit", details: "4 rounds: 20 press-ups, 25 sit-ups, 15 burpees, 30 squats. 45s rest." },
          { day: "Sat", workout: "Treadmill 2.4km Test", details: "Warm-up, then timed 2.4km at 2% incline. Record time." },
          { day: "Sun", workout: "Rest", details: "Recovery day. Stretch and hydrate." },
        ],
      },
      {
        week: 3,
        title: "Peak Performance",
        days: [
          { day: "Mon", workout: "Speed Intervals", details: "6x400m at target pace with 90s rest. 4x200m sprints with 60s rest." },
          { day: "Tue", workout: "Max Test Practice", details: "Max press-ups, rest 3 min, max sit-ups. Record numbers." },
          { day: "Wed", workout: "Active Recovery", details: "Easy 20 min swim or cycle." },
          { day: "Thu", workout: "Fartlek Run", details: "30 min fartlek on treadmill at 2% incline." },
          { day: "Fri", workout: "Full Mock Assessment", details: "Press-ups, sit-ups, bleep test, 2.4km run. Full simulation." },
          { day: "Sat", workout: "Easy Run", details: "20 min recovery jog." },
          { day: "Sun", workout: "Rest", details: "Full rest before test week." },
        ],
      },
      {
        week: 4,
        title: "Taper & Test",
        days: [
          { day: "Mon", workout: "Light Intervals", details: "4x400m at moderate pace. Keep effort at 70%." },
          { day: "Tue", workout: "Light Strength", details: "2x10 press-ups, 2x15 sit-ups. Easy session." },
          { day: "Wed", workout: "Rest", details: "Complete rest." },
          { day: "Thu", workout: "Easy Jog", details: "15 min very easy jog with strides." },
          { day: "Fri", workout: "Rest", details: "Pre-test rest. Prepare mentally." },
          { day: "Sat", workout: "PJFT TEST DAY", details: "2.4km treadmill run at 2% incline. Give everything!" },
          { day: "Sun", workout: "Recovery", details: "Celebrate and recover!" },
        ],
      },
    ],
  },
  {
    id: "raf",
    name: "RAF",
    fullName: "Royal Air Force",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    image: BRANCH_IMAGES.raf,
    description:
      "The RAF Pre-Joining Fitness Test requires you to pass the Multi-Stage Fitness Test (bleep test) and a treadmill run. Fitness is assessed at OASC or AFCO.",
    standards: [
      {
        exercise: "2.4km Treadmill Run",
        unit: "minutes",
        male: { under30: "11:11", over30: "11:56" },
        female: { under30: "13:23", over30: "14:00" },
        description:
          "Run 2.4km on a treadmill at 2% gradient. Faster target than Navy.",
      },
      {
        exercise: "Press-Ups (1 min)",
        unit: "reps",
        male: { under30: "20", over30: "18" },
        female: { under30: "10", over30: "8" },
        description:
          "Maximum press-ups in 1 minute. Full extension and chest to floor required.",
      },
      {
        exercise: "Sit-Ups (1 min)",
        unit: "reps",
        male: { under30: "35", over30: "30" },
        female: { under30: "32", over30: "27" },
        description:
          "Maximum sit-ups in 1 minute. Hands on temples, controlled movement.",
      },
      {
        exercise: "Bleep Test",
        unit: "level",
        male: { under30: "9.10", over30: "8.8" },
        female: { under30: "7.2", over30: "6.8" },
        description:
          "Multi-stage fitness test. Must reach minimum level for your age/gender.",
      },
    ],
    trainingPlan: [
      {
        week: 1,
        title: "Aerobic Base",
        days: [
          { day: "Mon", workout: "Easy Run", details: "25 min easy run. Focus on breathing and form." },
          { day: "Tue", workout: "Bodyweight Strength", details: "4x15 press-ups, 4x20 sit-ups, 3x20 squats, 3x30s plank." },
          { day: "Wed", workout: "Rest / Walk", details: "30 min brisk walk or rest." },
          { day: "Thu", workout: "Bleep Test Intro", details: "Practice bleep test. Aim for current max level. Rest and repeat x2." },
          { day: "Fri", workout: "Circuit", details: "3 rounds: 12 press-ups, 20 sit-ups, 15 squats, 8 burpees. 60s rest." },
          { day: "Sat", workout: "Long Run", details: "30 min steady run at moderate pace." },
          { day: "Sun", workout: "Rest", details: "Full recovery day." },
        ],
      },
      {
        week: 2,
        title: "Speed Development",
        days: [
          { day: "Mon", workout: "Tempo Run", details: "25 min with 10 min at tempo pace in the middle." },
          { day: "Tue", workout: "Press-Up Focus", details: "5x max press-ups in 1 min with 2 min rest. 4x20 sit-ups." },
          { day: "Wed", workout: "Active Recovery", details: "Light cycle or swim for 20 min." },
          { day: "Thu", workout: "Shuttle Runs", details: "10x20m shuttles, rest 30s. Repeat 4 sets with 2 min between sets." },
          { day: "Fri", workout: "Strength Circuit", details: "4 rounds: 15 press-ups, 25 sit-ups, 12 burpees, 25 squats." },
          { day: "Sat", workout: "2.4km Time Trial", details: "Warm-up, timed 2.4km run, cool-down. Record time." },
          { day: "Sun", workout: "Rest", details: "Recovery and stretching." },
        ],
      },
      {
        week: 3,
        title: "Test Simulation",
        days: [
          { day: "Mon", workout: "Interval Sprints", details: "8x200m at 90% effort with 60s rest. 4x400m at target pace." },
          { day: "Tue", workout: "Max Reps Testing", details: "1 min max press-ups, 3 min rest, 1 min max sit-ups. Record both." },
          { day: "Wed", workout: "Rest", details: "Complete rest." },
          { day: "Thu", workout: "Bleep Test Max", details: "Full bleep test to failure. Record level." },
          { day: "Fri", workout: "Full Mock Test", details: "Press-ups 1 min, sit-ups 1 min, 2.4km timed run. Full simulation." },
          { day: "Sat", workout: "Easy Recovery", details: "20 min easy jog." },
          { day: "Sun", workout: "Rest", details: "Rest before taper week." },
        ],
      },
      {
        week: 4,
        title: "Taper & Perform",
        days: [
          { day: "Mon", workout: "Light Speed Work", details: "4x200m at 80% effort. Keep it light." },
          { day: "Tue", workout: "Maintenance", details: "2x10 press-ups, 2x15 sit-ups. Very easy." },
          { day: "Wed", workout: "Rest", details: "Full rest." },
          { day: "Thu", workout: "Strides", details: "10 min jog with 4x100m strides." },
          { day: "Fri", workout: "Rest", details: "Pre-test rest." },
          { day: "Sat", workout: "TEST DAY", details: "Full RAF fitness assessment. Give 100%!" },
          { day: "Sun", workout: "Recovery", details: "Well done! Rest and recover." },
        ],
      },
    ],
  },
  {
    id: "police",
    name: "Police",
    fullName: "UK Police Service",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    image: BRANCH_IMAGES.police,
    description:
      "The Police fitness test includes the 15m Multi-Stage Fitness Test (bleep test) and a push/pull test simulating restraining a suspect. Standards vary by force.",
    standards: [
      {
        exercise: "15m Bleep Test",
        unit: "level",
        male: { under30: "5.4", over30: "5.4" },
        female: { under30: "5.4", over30: "5.4" },
        description:
          "15-metre shuttle run bleep test. Must reach level 5.4 minimum. Same standard for all.",
      },
      {
        exercise: "Push/Pull (Dyno)",
        unit: "kg",
        male: { under30: "34 push / 35 pull", over30: "34 push / 35 pull" },
        female: { under30: "34 push / 35 pull", over30: "34 push / 35 pull" },
        description:
          "Push 34kg and pull 35kg on a dynamometer. Simulates restraining a subject.",
      },
      {
        exercise: "Grip Strength",
        unit: "kg",
        male: { under30: "33", over30: "33" },
        female: { under30: "23", over30: "23" },
        description:
          "Grip strength measured with a dynamometer. Tests hand/forearm strength.",
      },
      {
        exercise: "1.5 Mile Run (optional)",
        unit: "minutes",
        male: { under30: "14:00", over30: "14:30" },
        female: { under30: "16:00", over30: "16:30" },
        description:
          "Some forces require a 1.5 mile run. Check with your specific force for requirements.",
      },
    ],
    trainingPlan: [
      {
        week: 1,
        title: "General Fitness",
        days: [
          { day: "Mon", workout: "Easy Run + Core", details: "20 min easy jog. 3x20 sit-ups, 3x30s plank, 3x15 press-ups." },
          { day: "Tue", workout: "Strength Training", details: "3x10 push-ups, 3x10 rows, 3x10 squats, 3x10 lunges. Focus on push/pull." },
          { day: "Wed", workout: "Rest", details: "Rest or light walk." },
          { day: "Thu", workout: "Shuttle Runs", details: "Practice 15m shuttles. 6x15m at bleep test pace with 30s rest. Repeat 3 sets." },
          { day: "Fri", workout: "Push/Pull Focus", details: "4x10 chest press, 4x10 seated rows, 3x10 shoulder press, grip squeezes 3x30s." },
          { day: "Sat", workout: "Cardio", details: "30 min run or cycle at moderate pace." },
          { day: "Sun", workout: "Rest", details: "Full rest day." },
        ],
      },
      {
        week: 2,
        title: "Specificity Training",
        days: [
          { day: "Mon", workout: "Bleep Test Practice", details: "Full 15m bleep test to max. Record level. Rest 5 min, repeat." },
          { day: "Tue", workout: "Push/Pull Power", details: "5x8 heavy chest press, 5x8 heavy rows, 4x10 push-ups, grip work 4x30s." },
          { day: "Wed", workout: "Active Recovery", details: "20 min swim or easy cycle." },
          { day: "Thu", workout: "Interval Training", details: "8x30s sprint / 30s rest. Then 4x1 min hard / 1 min easy." },
          { day: "Fri", workout: "Full Body Strength", details: "3x12 press-ups, 3x12 rows, 3x15 squats, 3x10 lunges, grip work." },
          { day: "Sat", workout: "Long Run", details: "35 min steady run." },
          { day: "Sun", workout: "Rest", details: "Recovery day." },
        ],
      },
      {
        week: 3,
        title: "Assessment Prep",
        days: [
          { day: "Mon", workout: "Speed Shuttles", details: "10x15m at max speed with 20s rest. 3 sets with 3 min between." },
          { day: "Tue", workout: "Max Strength", details: "Work up to max push/pull on machine. 5x5 heavy sets." },
          { day: "Wed", workout: "Rest", details: "Complete rest." },
          { day: "Thu", workout: "Bleep Test Simulation", details: "Full 15m bleep test. Target level 5.4+. Record result." },
          { day: "Fri", workout: "Full Mock Assessment", details: "Bleep test, push/pull test, grip test. Full simulation." },
          { day: "Sat", workout: "Easy Run", details: "20 min recovery jog." },
          { day: "Sun", workout: "Rest", details: "Rest before final week." },
        ],
      },
      {
        week: 4,
        title: "Test Ready",
        days: [
          { day: "Mon", workout: "Light Shuttles", details: "6x15m at 70% effort. Stay sharp but don't fatigue." },
          { day: "Tue", workout: "Light Push/Pull", details: "3x5 moderate chest press and rows. Grip squeezes 2x20s." },
          { day: "Wed", workout: "Rest", details: "Full rest." },
          { day: "Thu", workout: "Easy Jog", details: "15 min very easy jog." },
          { day: "Fri", workout: "Rest", details: "Pre-test rest. Prepare mentally." },
          { day: "Sat", workout: "ASSESSMENT DAY", details: "Full police fitness assessment. You've got this!" },
          { day: "Sun", workout: "Recovery", details: "Well done! Rest and celebrate." },
        ],
      },
    ],
  },
];

export const tips: Tip[] = [
  {
    title: "Start Early",
    icon: "⏰",
    content:
      "Begin training at least 8-12 weeks before your assessment date. This gives your body time to adapt and build the fitness levels required. Rushing preparation increases injury risk.",
  },
  {
    title: "Nutrition Matters",
    icon: "🥗",
    content:
      "Fuel your training with balanced meals: lean protein (chicken, fish, eggs), complex carbs (oats, rice, sweet potato), healthy fats (avocado, nuts), and plenty of vegetables. Stay hydrated with 2-3 litres of water daily.",
  },
  {
    title: "Sleep & Recovery",
    icon: "😴",
    content:
      "Aim for 7-9 hours of quality sleep per night. Your body repairs and builds muscle during sleep. Avoid screens 1 hour before bed and maintain a consistent sleep schedule.",
  },
  {
    title: "Practice the Actual Tests",
    icon: "🎯",
    content:
      "Simulate the exact test conditions regularly. If your test is on a treadmill at 2% incline, train on one. If it's the bleep test, practice with the actual audio. Familiarity reduces anxiety on test day.",
  },
  {
    title: "Mental Preparation",
    icon: "🧠",
    content:
      "Visualise yourself passing the test. Break the test into smaller chunks mentally. During the run, focus on the next 30 seconds, not the whole distance. Positive self-talk makes a real difference.",
  },
  {
    title: "Warm Up Properly",
    icon: "🔥",
    content:
      "Always warm up for 5-10 minutes before training and testing. Dynamic stretches (leg swings, arm circles, high knees) prepare your muscles and reduce injury risk. Never skip this.",
  },
  {
    title: "Assessment Day Tips",
    icon: "📋",
    content:
      "Arrive early and well-rested. Eat a light meal 2-3 hours before. Bring water, appropriate clothing, and ID. Listen to all instructions carefully. Start at a sustainable pace — don't burn out in the first minute.",
  },
  {
    title: "Common Mistakes to Avoid",
    icon: "⚠️",
    content:
      "Don't overtrain — rest days are essential. Don't neglect upper body for running or vice versa. Don't try new foods/supplements on test day. Don't compare yourself to others — focus on meeting YOUR targets.",
  },
];

// LocalStorage helpers
const STORAGE_KEY = "recruitready_progress";
const BRANCH_KEY = "recruitready_branch";

export function getStoredBranch(): Branch {
  if (typeof window === "undefined") return "army";
  return (localStorage.getItem(BRANCH_KEY) as Branch) || "army";
}

export function setStoredBranch(branch: Branch): void {
  localStorage.setItem(BRANCH_KEY, branch);
}

export function getProgressEntries(): ProgressEntry[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function addProgressEntry(entry: ProgressEntry): void {
  const entries = getProgressEntries();
  entries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function deleteProgressEntry(id: string): void {
  const entries = getProgressEntries().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function clearAllProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Streak helpers
export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastLogDate: string | null;
  isActiveToday: boolean;
  totalDaysLogged: number;
}

/**
 * Calculate streak info from progress entries.
 * A streak counts consecutive calendar days with at least one logged entry.
 * Today or yesterday count as "active" for current streak continuity.
 */
export function getStreakInfo(): StreakInfo {
  const entries = getProgressEntries();
  if (entries.length === 0) {
    return { currentStreak: 0, bestStreak: 0, lastLogDate: null, isActiveToday: false, totalDaysLogged: 0 };
  }

  // Get unique dates (YYYY-MM-DD) sorted descending
  const uniqueDates = Array.from(
    new Set(entries.map((e) => e.date.split("T")[0]))
  ).sort((a, b) => b.localeCompare(a));

  const totalDaysLogged = uniqueDates.length;
  const lastLogDate = uniqueDates[0];

  // Check if today or yesterday was logged
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const isActiveToday = lastLogDate === todayStr;

  // Calculate current streak
  let currentStreak = 0;
  // Start from today if logged today, or yesterday if logged yesterday
  let checkDate: Date;
  if (lastLogDate === todayStr) {
    checkDate = new Date(today);
  } else if (lastLogDate === yesterdayStr) {
    checkDate = new Date(yesterday);
  } else {
    // Streak is broken
    return { currentStreak: 0, bestStreak: calculateBestStreak(uniqueDates), lastLogDate, isActiveToday, totalDaysLogged };
  }

  const dateSet = new Set(uniqueDates);
  while (dateSet.has(checkDate.toISOString().split("T")[0])) {
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const bestStreak = Math.max(currentStreak, calculateBestStreak(uniqueDates));

  return { currentStreak, bestStreak, lastLogDate, isActiveToday, totalDaysLogged };
}

function calculateBestStreak(sortedDatesDesc: string[]): number {
  if (sortedDatesDesc.length === 0) return 0;

  // Sort ascending for easier iteration
  const dates = [...sortedDatesDesc].sort();
  let best = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diffMs = curr.getTime() - prev.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      current++;
      best = Math.max(best, current);
    } else if (diffDays > 1) {
      current = 1;
    }
    // diffDays === 0 means same day, skip
  }

  return best;
}