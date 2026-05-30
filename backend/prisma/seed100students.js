// prisma/seed100students.js
// ─────────────────────────────────────────────────────────
// Adds 100 dummy UAF students — all with password "Student@UAF2024"
// but unique emails, varied CGPAs, departments, semesters, etc.
// Run with:  node prisma/seed100students.js
// ─────────────────────────────────────────────────────────

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

// ─── Helpers ───────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ─── Static data ───────────────────────────────────────────

const DEPARTMENTS = [
  "Computer Science",
  "Agronomy",
  "Plant Pathology",
  "Food Technology",
  "Agricultural Engineering",
  "Horticulture",
  "Soil Science",
  "Animal Husbandry",
];

const PROGRAMS = {
  "Computer Science":         "BS Computer Science",
  "Agronomy":                 "BS Agronomy",
  "Plant Pathology":          "BS Plant Pathology",
  "Food Technology":          "BS Food Technology",
  "Agricultural Engineering": "BE Agricultural Engineering",
  "Horticulture":             "BS Horticulture",
  "Soil Science":             "BS Soil Science",
  "Animal Husbandry":         "BS Animal Husbandry",
};

// 100 explicitly defined students — each unique, realistic, varied
const STUDENTS = [
  // Computer Science — Semester 1-8, wide CGPA range
  { firstName:"Ali",       lastName:"Khan",      gender:"MALE",   dept:"Computer Science",         year:2021, sem:7, cgpa:3.85, phone:"03001234567", hostel:true,  block:"A", room:"101" },
  { firstName:"Fatima",    lastName:"Zahra",     gender:"FEMALE", dept:"Computer Science",         year:2022, sem:5, cgpa:3.92, phone:"03011234568", hostel:false, block:null, room:null },
  { firstName:"Usman",     lastName:"Raza",      gender:"MALE",   dept:"Computer Science",         year:2023, sem:3, cgpa:2.75, phone:"03021234569", hostel:true,  block:"B", room:"205" },
  { firstName:"Ayesha",    lastName:"Siddiqua",  gender:"FEMALE", dept:"Computer Science",         year:2020, sem:8, cgpa:3.50, phone:"03031234570", hostel:false, block:null, room:null },
  { firstName:"Bilal",     lastName:"Ahmed",     gender:"MALE",   dept:"Computer Science",         year:2021, sem:7, cgpa:2.20, phone:"03041234571", hostel:true,  block:"C", room:"310" },
  { firstName:"Hira",      lastName:"Baig",      gender:"FEMALE", dept:"Computer Science",         year:2022, sem:5, cgpa:3.10, phone:"03051234572", hostel:true,  block:"D", room:"412" },
  { firstName:"Hamza",     lastName:"Sheikh",    gender:"MALE",   dept:"Computer Science",         year:2023, sem:3, cgpa:1.95, phone:"03061234573", hostel:false, block:null, room:null },
  { firstName:"Zainab",    lastName:"Noor",      gender:"FEMALE", dept:"Computer Science",         year:2020, sem:8, cgpa:4.00, phone:"03071234574", hostel:false, block:null, room:null },
  { firstName:"Faisal",    lastName:"Mehmood",   gender:"MALE",   dept:"Computer Science",         year:2021, sem:7, cgpa:3.30, phone:"03081234575", hostel:true,  block:"A", room:"115" },
  { firstName:"Sana",      lastName:"Malik",     gender:"FEMALE", dept:"Computer Science",         year:2022, sem:5, cgpa:2.90, phone:"03091234576", hostel:false, block:null, room:null },
  { firstName:"Zeeshan",   lastName:"Anjum",     gender:"MALE",   dept:"Computer Science",         year:2023, sem:3, cgpa:3.70, phone:"03101234577", hostel:true,  block:"B", room:"220" },
  { firstName:"Amna",      lastName:"Riaz",      gender:"FEMALE", dept:"Computer Science",         year:2020, sem:8, cgpa:3.45, phone:"03111234578", hostel:false, block:null, room:null },
  { firstName:"Kamran",    lastName:"Iqbal",     gender:"MALE",   dept:"Computer Science",         year:2021, sem:7, cgpa:2.60, phone:"03121234579", hostel:false, block:null, room:null },

  // Agronomy
  { firstName:"Tariq",     lastName:"Mahmood",   gender:"MALE",   dept:"Agronomy",                 year:2021, sem:7, cgpa:3.20, phone:"03131234580", hostel:true,  block:"E", room:"501" },
  { firstName:"Maham",     lastName:"Khan",      gender:"FEMALE", dept:"Agronomy",                 year:2022, sem:5, cgpa:2.80, phone:"03141234581", hostel:false, block:null, room:null },
  { firstName:"Imran",     lastName:"Butt",      gender:"MALE",   dept:"Agronomy",                 year:2023, sem:3, cgpa:3.55, phone:"03151234582", hostel:true,  block:"A", room:"108" },
  { firstName:"Saima",     lastName:"Akhtar",    gender:"FEMALE", dept:"Agronomy",                 year:2020, sem:8, cgpa:1.80, phone:"03161234583", hostel:false, block:null, room:null },
  { firstName:"Umer",      lastName:"Farooq",    gender:"MALE",   dept:"Agronomy",                 year:2021, sem:7, cgpa:3.75, phone:"03171234584", hostel:true,  block:"C", room:"302" },
  { firstName:"Nadia",     lastName:"Hussain",   gender:"FEMALE", dept:"Agronomy",                 year:2022, sem:5, cgpa:3.00, phone:"03181234585", hostel:false, block:null, room:null },
  { firstName:"Saad",      lastName:"Mirza",     gender:"MALE",   dept:"Agronomy",                 year:2023, sem:3, cgpa:2.40, phone:"03191234586", hostel:true,  block:"B", room:"211" },
  { firstName:"Rida",      lastName:"Farooq",    gender:"FEMALE", dept:"Agronomy",                 year:2020, sem:8, cgpa:3.90, phone:"03201234587", hostel:false, block:null, room:null },
  { firstName:"Arslan",    lastName:"Qureshi",   gender:"MALE",   dept:"Agronomy",                 year:2021, sem:7, cgpa:2.10, phone:"03211234588", hostel:false, block:null, room:null },

  // Food Technology
  { firstName:"Iqra",      lastName:"Butt",      gender:"FEMALE", dept:"Food Technology",          year:2022, sem:5, cgpa:3.65, phone:"03221234589", hostel:true,  block:"D", room:"420" },
  { firstName:"Waqas",     lastName:"Saleem",    gender:"MALE",   dept:"Food Technology",          year:2023, sem:3, cgpa:2.50, phone:"03231234590", hostel:false, block:null, room:null },
  { firstName:"Mehwish",   lastName:"Saleem",    gender:"FEMALE", dept:"Food Technology",          year:2020, sem:8, cgpa:3.80, phone:"03241234591", hostel:false, block:null, room:null },
  { firstName:"Noman",     lastName:"Aslam",     gender:"MALE",   dept:"Food Technology",          year:2021, sem:7, cgpa:1.70, phone:"03251234592", hostel:true,  block:"A", room:"122" },
  { firstName:"Kiran",     lastName:"Anwar",     gender:"FEMALE", dept:"Food Technology",          year:2022, sem:5, cgpa:3.35, phone:"03261234593", hostel:false, block:null, room:null },
  { firstName:"Danish",    lastName:"Aziz",      gender:"MALE",   dept:"Food Technology",          year:2023, sem:3, cgpa:2.95, phone:"03271234594", hostel:true,  block:"C", room:"315" },
  { firstName:"Shazia",    lastName:"Ahmed",     gender:"FEMALE", dept:"Food Technology",          year:2020, sem:8, cgpa:3.15, phone:"03281234595", hostel:false, block:null, room:null },

  // Plant Pathology
  { firstName:"Junaid",    lastName:"Shah",      gender:"MALE",   dept:"Plant Pathology",          year:2021, sem:7, cgpa:2.85, phone:"03291234596", hostel:true,  block:"B", room:"230" },
  { firstName:"Bushra",    lastName:"Iqbal",     gender:"FEMALE", dept:"Plant Pathology",          year:2022, sem:5, cgpa:3.60, phone:"03301234597", hostel:false, block:null, room:null },
  { firstName:"Adnan",     lastName:"Siddiqui",  gender:"MALE",   dept:"Plant Pathology",          year:2023, sem:3, cgpa:1.60, phone:"03311234598", hostel:false, block:null, room:null },
  { firstName:"Rabia",     lastName:"Nawaz",     gender:"FEMALE", dept:"Plant Pathology",          year:2020, sem:8, cgpa:3.95, phone:"03321234599", hostel:true,  block:"E", room:"510" },
  { firstName:"Waseem",    lastName:"Baig",      gender:"MALE",   dept:"Plant Pathology",          year:2021, sem:7, cgpa:2.35, phone:"03331234600", hostel:false, block:null, room:null },
  { firstName:"Sobia",     lastName:"Chaudhry",  gender:"FEMALE", dept:"Plant Pathology",          year:2022, sem:5, cgpa:3.40, phone:"03341234601", hostel:true,  block:"D", room:"405" },

  // Agricultural Engineering
  { firstName:"Shoaib",    lastName:"Akhtar",    gender:"MALE",   dept:"Agricultural Engineering", year:2023, sem:3, cgpa:3.05, phone:"03351234602", hostel:true,  block:"A", room:"130" },
  { firstName:"Anum",      lastName:"Javed",     gender:"FEMALE", dept:"Agricultural Engineering", year:2020, sem:8, cgpa:2.65, phone:"03361234603", hostel:false, block:null, room:null },
  { firstName:"Rizwan",    lastName:"Haider",    gender:"MALE",   dept:"Agricultural Engineering", year:2021, sem:7, cgpa:3.88, phone:"03371234604", hostel:true,  block:"B", room:"215" },
  { firstName:"Naila",     lastName:"Shah",      gender:"FEMALE", dept:"Agricultural Engineering", year:2022, sem:5, cgpa:2.15, phone:"03381234605", hostel:false, block:null, room:null },
  { firstName:"Asim",      lastName:"Javed",     gender:"MALE",   dept:"Agricultural Engineering", year:2023, sem:3, cgpa:3.50, phone:"03391234606", hostel:false, block:null, room:null },
  { firstName:"Afsheen",   lastName:"Tanvir",    gender:"FEMALE", dept:"Agricultural Engineering", year:2020, sem:8, cgpa:3.22, phone:"03401234607", hostel:true,  block:"C", room:"320" },
  { firstName:"Nabeel",    lastName:"Anwar",     gender:"MALE",   dept:"Agricultural Engineering", year:2021, sem:7, cgpa:1.90, phone:"03411234608", hostel:false, block:null, room:null },

  // Horticulture
  { firstName:"Dawood",    lastName:"Tanvir",    gender:"MALE",   dept:"Horticulture",             year:2022, sem:5, cgpa:3.70, phone:"03421234609", hostel:true,  block:"E", room:"520" },
  { firstName:"Maryam",    lastName:"Aslam",     gender:"FEMALE", dept:"Horticulture",             year:2023, sem:3, cgpa:2.55, phone:"03431234610", hostel:false, block:null, room:null },
  { firstName:"Fahad",     lastName:"Chaudhry",  gender:"MALE",   dept:"Horticulture",             year:2020, sem:8, cgpa:3.30, phone:"03441234611", hostel:false, block:null, room:null },
  { firstName:"Sadia",     lastName:"Qureshi",   gender:"FEMALE", dept:"Horticulture",             year:2021, sem:7, cgpa:3.78, phone:"03451234612", hostel:true,  block:"A", room:"140" },
  { firstName:"Talha",     lastName:"Nawaz",     gender:"MALE",   dept:"Horticulture",             year:2022, sem:5, cgpa:2.00, phone:"03461234613", hostel:false, block:null, room:null },
  { firstName:"Huma",      lastName:"Raza",      gender:"FEMALE", dept:"Horticulture",             year:2023, sem:3, cgpa:3.55, phone:"03471234614", hostel:true,  block:"D", room:"430" },
  { firstName:"Muneeb",    lastName:"Rehman",    gender:"MALE",   dept:"Horticulture",             year:2020, sem:8, cgpa:2.70, phone:"03481234615", hostel:false, block:null, room:null },

  // Soil Science
  { firstName:"Jahanzeb",  lastName:"Ali",       gender:"MALE",   dept:"Soil Science",             year:2021, sem:7, cgpa:3.15, phone:"03491234616", hostel:true,  block:"B", room:"240" },
  { firstName:"Nimra",     lastName:"Mirza",     gender:"FEMALE", dept:"Soil Science",             year:2022, sem:5, cgpa:3.88, phone:"03501234617", hostel:false, block:null, room:null },
  { firstName:"Saqib",     lastName:"Hussain",   gender:"MALE",   dept:"Soil Science",             year:2023, sem:3, cgpa:2.30, phone:"03511234618", hostel:false, block:null, room:null },
  { firstName:"Uzma",      lastName:"Baig",      gender:"FEMALE", dept:"Soil Science",             year:2020, sem:8, cgpa:3.65, phone:"03521234619", hostel:true,  block:"C", room:"330" },
  { firstName:"Khurram",   lastName:"Shahid",    gender:"MALE",   dept:"Soil Science",             year:2021, sem:7, cgpa:1.75, phone:"03531234620", hostel:false, block:null, room:null },
  { firstName:"Layla",     lastName:"Rehman",    gender:"FEMALE", dept:"Soil Science",             year:2022, sem:5, cgpa:3.42, phone:"03541234621", hostel:true,  block:"E", room:"515" },

  // Animal Husbandry
  { firstName:"Ahmad",     lastName:"Hassan",    gender:"MALE",   dept:"Animal Husbandry",         year:2023, sem:3, cgpa:2.88, phone:"03551234622", hostel:true,  block:"A", room:"150" },
  { firstName:"Summaiya",  lastName:"Tariq",     gender:"FEMALE", dept:"Animal Husbandry",         year:2020, sem:8, cgpa:3.58, phone:"03561234623", hostel:false, block:null, room:null },
  { firstName:"Khurram",   lastName:"Ali",       gender:"MALE",   dept:"Animal Husbandry",         year:2021, sem:7, cgpa:2.45, phone:"03571234624", hostel:false, block:null, room:null },
  { firstName:"Fariha",    lastName:"Imran",     gender:"FEMALE", dept:"Animal Husbandry",         year:2022, sem:5, cgpa:3.25, phone:"03581234625", hostel:true,  block:"D", room:"440" },
  { firstName:"Waqas",     lastName:"Nawaz",     gender:"MALE",   dept:"Animal Husbandry",         year:2023, sem:3, cgpa:3.82, phone:"03591234626", hostel:false, block:null, room:null },
  { firstName:"Zara",      lastName:"Waqas",     gender:"FEMALE", dept:"Animal Husbandry",         year:2020, sem:8, cgpa:2.20, phone:"03601234627", hostel:true,  block:"B", room:"260" },
  { firstName:"Hajra",     lastName:"Shahid",    gender:"FEMALE", dept:"Animal Husbandry",         year:2021, sem:7, cgpa:3.95, phone:"03611234628", hostel:false, block:null, room:null },

  // More CS students with varied stats
  { firstName:"Muhammad",  lastName:"Usman",     gender:"MALE",   dept:"Computer Science",         year:2019, sem:8, cgpa:2.05, phone:"03621234629", hostel:true,  block:"C", room:"340" },
  { firstName:"Areeba",    lastName:"Ghani",     gender:"FEMALE", dept:"Computer Science",         year:2022, sem:5, cgpa:3.72, phone:"03631234630", hostel:false, block:null, room:null },
  { firstName:"Shahzad",   lastName:"Mirza",     gender:"MALE",   dept:"Computer Science",         year:2023, sem:3, cgpa:1.55, phone:"03641234631", hostel:false, block:null, room:null },
  { firstName:"Komal",     lastName:"Yousaf",    gender:"FEMALE", dept:"Computer Science",         year:2020, sem:8, cgpa:3.40, phone:"03651234632", hostel:true,  block:"E", room:"505" },
  { firstName:"Rehan",     lastName:"Azhar",     gender:"MALE",   dept:"Computer Science",         year:2021, sem:7, cgpa:2.90, phone:"03661234633", hostel:false, block:null, room:null },
  { firstName:"Alishba",   lastName:"Farhat",    gender:"FEMALE", dept:"Computer Science",         year:2022, sem:5, cgpa:3.60, phone:"03671234634", hostel:true,  block:"A", room:"160" },
  { firstName:"Sohaib",    lastName:"Khan",      gender:"MALE",   dept:"Computer Science",         year:2023, sem:3, cgpa:3.15, phone:"03681234635", hostel:false, block:null, room:null },
  { firstName:"Madiha",    lastName:"Rana",      gender:"FEMALE", dept:"Computer Science",         year:2019, sem:8, cgpa:2.75, phone:"03691234636", hostel:true,  block:"B", room:"270" },

  // More diverse departments to hit 100
  { firstName:"Hassaan",   lastName:"Tariq",     gender:"MALE",   dept:"Agronomy",                 year:2022, sem:5, cgpa:3.48, phone:"03701234637", hostel:false, block:null, room:null },
  { firstName:"Misbah",    lastName:"Chaudhry",  gender:"FEMALE", dept:"Agronomy",                 year:2023, sem:3, cgpa:2.62, phone:"03711234638", hostel:true,  block:"C", room:"350" },
  { firstName:"Obaid",     lastName:"Rehman",    gender:"MALE",   dept:"Food Technology",          year:2020, sem:8, cgpa:3.83, phone:"03721234639", hostel:false, block:null, room:null },
  { firstName:"Tayyaba",   lastName:"Iqbal",     gender:"FEMALE", dept:"Food Technology",          year:2021, sem:7, cgpa:2.18, phone:"03731234640", hostel:true,  block:"D", room:"450" },
  { firstName:"Salman",    lastName:"Durrani",   gender:"MALE",   dept:"Plant Pathology",          year:2022, sem:5, cgpa:3.37, phone:"03741234641", hostel:false, block:null, room:null },
  { firstName:"Aisha",     lastName:"Habib",     gender:"FEMALE", dept:"Plant Pathology",          year:2023, sem:3, cgpa:3.68, phone:"03751234642", hostel:true,  block:"E", room:"525" },
  { firstName:"Ghulam",    lastName:"Mustafa",   gender:"MALE",   dept:"Agricultural Engineering", year:2019, sem:8, cgpa:2.42, phone:"03761234643", hostel:false, block:null, room:null },
  { firstName:"Riffat",    lastName:"Kamal",     gender:"FEMALE", dept:"Agricultural Engineering", year:2020, sem:8, cgpa:3.57, phone:"03771234644", hostel:true,  block:"A", room:"170" },
  { firstName:"Nasir",     lastName:"Javed",     gender:"MALE",   dept:"Horticulture",             year:2021, sem:7, cgpa:2.28, phone:"03781234645", hostel:false, block:null, room:null },
  { firstName:"Sabiha",    lastName:"Naqvi",     gender:"FEMALE", dept:"Horticulture",             year:2022, sem:5, cgpa:3.93, phone:"03791234646", hostel:true,  block:"B", room:"280" },
  { firstName:"Haris",     lastName:"Munir",     gender:"MALE",   dept:"Soil Science",             year:2023, sem:3, cgpa:1.88, phone:"03801234647", hostel:false, block:null, room:null },
  { firstName:"Zobia",     lastName:"Latif",     gender:"FEMALE", dept:"Soil Science",             year:2019, sem:8, cgpa:3.77, phone:"03811234648", hostel:true,  block:"C", room:"360" },
  { firstName:"Irfan",     lastName:"Pervaiz",   gender:"MALE",   dept:"Animal Husbandry",         year:2020, sem:8, cgpa:2.52, phone:"03821234649", hostel:false, block:null, room:null },
  { firstName:"Rukhsana",  lastName:"Bibi",      gender:"FEMALE", dept:"Animal Husbandry",         year:2021, sem:7, cgpa:3.12, phone:"03831234650", hostel:true,  block:"D", room:"460" },
  { firstName:"Mohsin",    lastName:"Bashir",    gender:"MALE",   dept:"Computer Science",         year:2022, sem:5, cgpa:3.98, phone:"03841234651", hostel:false, block:null, room:null },
  { firstName:"Lubna",     lastName:"Arif",      gender:"FEMALE", dept:"Computer Science",         year:2023, sem:3, cgpa:2.33, phone:"03851234652", hostel:true,  block:"E", room:"530" },
  { firstName:"Farhan",    lastName:"Basharat",  gender:"MALE",   dept:"Agronomy",                 year:2019, sem:8, cgpa:3.62, phone:"03861234653", hostel:false, block:null, room:null },
  { firstName:"Noor",      lastName:"Fatima",    gender:"FEMALE", dept:"Agronomy",                 year:2020, sem:8, cgpa:2.08, phone:"03871234654", hostel:true,  block:"A", room:"180" },
  { firstName:"Shahbaz",   lastName:"Ahmad",     gender:"MALE",   dept:"Food Technology",          year:2021, sem:7, cgpa:3.44, phone:"03881234655", hostel:false, block:null, room:null },
  { firstName:"Yasmeen",   lastName:"Bhatti",    gender:"FEMALE", dept:"Food Technology",          year:2022, sem:5, cgpa:3.02, phone:"03891234656", hostel:true,  block:"B", room:"290" },
  { firstName:"Osama",     lastName:"Khalil",    gender:"MALE",   dept:"Plant Pathology",          year:2023, sem:3, cgpa:2.78, phone:"03901234657", hostel:false, block:null, room:null },
  { firstName:"Mariam",    lastName:"Zafar",     gender:"FEMALE", dept:"Plant Pathology",          year:2019, sem:8, cgpa:3.87, phone:"03911234658", hostel:true,  block:"C", room:"370" },
  { firstName:"Umar",      lastName:"Sohail",    gender:"MALE",   dept:"Agricultural Engineering", year:2020, sem:8, cgpa:1.65, phone:"03921234659", hostel:false, block:null, room:null },
  { firstName:"Nargis",    lastName:"Parveen",   gender:"FEMALE", dept:"Horticulture",             year:2021, sem:7, cgpa:3.53, phone:"03931234660", hostel:true,  block:"D", room:"470" },
  { firstName:"Rizwan",    lastName:"Mehmood",   gender:"MALE",   dept:"Soil Science",             year:2022, sem:5, cgpa:2.97, phone:"03941234661", hostel:false, block:null, room:null },
  { firstName:"Sidra",     lastName:"Khan",      gender:"FEMALE", dept:"Animal Husbandry",         year:2023, sem:3, cgpa:3.18, phone:"03951234662", hostel:false, block:null, room:null },
  { firstName:"Tahir",     lastName:"Javed",     gender:"MALE",   dept:"Computer Science",         year:2021, sem:7, cgpa:3.26, phone:"03961234663", hostel:true,  block:"A", room:"182" },
  { firstName:"Saira",     lastName:"Raza",      gender:"FEMALE", dept:"Plant Pathology",          year:2022, sem:5, cgpa:3.45, phone:"03971234664", hostel:true,  block:"B", room:"225" },
  { firstName:"Feroz",     lastName:"Nawaz",     gender:"MALE",   dept:"Agronomy",                 year:2020, sem:8, cgpa:2.88, phone:"03981234665", hostel:false, block:null, room:null },
  { firstName:"Mina",      lastName:"Hashmi",    gender:"FEMALE", dept:"Food Technology",          year:2021, sem:7, cgpa:3.79, phone:"03991234666", hostel:false, block:null, room:null },
];

// Build a clean email from name + department + index
function buildEmail(firstName, lastName, dept, index) {
  const deptCode = {
    "Computer Science":         "cs",
    "Agronomy":                 "agr",
    "Plant Pathology":          "pp",
    "Food Technology":          "ft",
    "Agricultural Engineering": "ae",
    "Horticulture":             "hort",
    "Soil Science":             "ss",
    "Animal Husbandry":         "ah",
  }[dept] || "gen";
  const fn = firstName.toLowerCase().replace(/\s/g, "");
  const ln = lastName.toLowerCase().replace(/\s/g, "");
  return `${fn}.${ln}.${deptCode}${String(index + 1).padStart(3, "0")}@uaf.edu.pk`;
}

// Build a registration ID
function buildRegId(year, dept, index) {
  const deptCode = dept.substring(0, 2).toLowerCase();
  return `${year}-${deptCode}-${String(8001 + index).padStart(4, "0")}`;
}

// ─── MAIN ──────────────────────────────────────────────────
// `seed100Students` is the exported helper used by `prisma/seed.js`
async function seed100Students(prismaClient = prisma, options = {}) {
  const displayOnly = Boolean(options.displayOnly);
  console.log(`🌱 Seeding ${STUDENTS.length} ${displayOnly ? "display-only " : ""}students...\n`);

  const PASSWORD = "Student@UAF2024";
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  let created = 0;
  let skipped = 0;
  const credentials = [];

  for (let i = 0; i < STUDENTS.length; i++) {
    const s = STUDENTS[i];
    const email    = buildEmail(s.firstName, s.lastName, s.dept, i);
    const regId    = buildRegId(s.year, s.dept, i);
    credentials.push({ email, password: PASSWORD });

    // Skip if email already exists
    const exists = await prismaClient.user.findUnique({ where: { email } });
    if (exists) {
      console.log(`  ⚠️  Skipped (already exists): ${email}`);
      skipped++;
      continue;
    }

    await prismaClient.user.create({
      data: {
        email,
        passwordHash,
        role: "STUDENT",
        isActive: !displayOnly,
        profile: {
          create: {
            firstName:       s.firstName,
            lastName:        s.lastName,
            gender:          s.gender,
            registrationId:  regId,
            department:      s.dept,
            program:         PROGRAMS[s.dept],
            currentSemester: s.sem,
            enrollmentYear:  s.year,
            expectedGradYear:s.year + 4,
            cgpa:            s.cgpa,
            phone:           s.phone,
            isHostelResident:s.hostel,
            hostelBlock:     s.block  ?? null,
            roomNumber:      s.room   ?? null,
          },
        },
      },
    });

    console.log(
      `  ✅ [${String(i + 1).padStart(3, "0")}] ${s.firstName} ${s.lastName.padEnd(12)} | ${s.dept.padEnd(26)} | Sem ${s.sem} | CGPA ${s.cgpa.toFixed(2)} | ${email}`
    );
    created++;
  }

  console.log(`
╔══════════════════════════════════════════════╗
║   ✅  100 STUDENT SEED COMPLETE!              ║
╠══════════════════════════════════════════════╣
║  Created : ${String(created).padEnd(35)}║
║  Skipped : ${String(skipped).padEnd(35)}║
╠══════════════════════════════════════════════╣
║  ${displayOnly ? "DISPLAY ONLY — cannot log in" : "SHARED PASSWORD: Student@UAF2024"}             ║
║  ${displayOnly ? "Shown on admin dashboard only.           " : "Any student email above can log in.          "} ║
╚══════════════════════════════════════════════╝
  `);

  console.log("\n🔐 100 student login credentials:\n");
  credentials.forEach((cred, index) => {
    console.log(`${String(index + 1).padStart(3, "0")}. ${cred.email} / ${cred.password}`);
  });

  return { created, skipped, credentials };
}

if (require.main === module) {
  seed100Students()
    .catch((e) => {
      console.error("❌ Seed failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seed100Students };
