// ─────────────────────────────────────────────────────────────
//  RESOURCE TREE
//
//  The website mirrors the teacher's own folder structure.
//  Every folder = a card. Every file/link inside = an item.
//
//  (Teachers can also add folders and material from the website itself —
//   see src/library/. What is listed here is the built-in, permanent part.)
//
//  To add material:
//    1. Drop the file into  /public/resources/<grade>/<...same path...>/
//    2. Add an item to the matching folder's `items` array below
//       (or a new folder to `children`).
//
//  Folder:  { id, name:{en,ar}, description?:{en,ar}, icon, children:[], items:[] }
//  Link card (opens in a new tab):  { id, name, description, icon, link:'https://…' }
//
//  Item types:
//    pdf      → { file, thumbnail? }              previews in the site
//    docx     → { file, preview? (pdf) }          download + optional pdf preview
//    image    → { file }                          gallery + lightbox
//    video    → { file, thumbnail?, duration? }   plays in the site
//    youtube  → { youtubeId }                     embedded player + open on YouTube
//    facebook → { url }                           opens on Facebook (new tab)
//    wordwall → { url }                           plays in the site + open on Wordwall
//    link     → { url }                           opens in a new tab
// ─────────────────────────────────────────────────────────────

const R = '/resources/grade-4/semester-1'

// ── Grade 4 ───────────────────────────────────────────────────
const grade4 = {
  id: 'grade-4',
  number: 4,
  name: { en: 'Grade 4', ar: 'الصف الرابع' },
  tagline: { en: 'First steps into confident English.', ar: 'الخطوات الأولى نحو إنجليزية واثقة.' },
  description: {
    en: 'Foundations of reading, everyday vocabulary and simple sentences with the English for Palestine 4 book. Lessons are playful, short and full of speaking practice.',
    ar: 'أساسيات القراءة والمفردات اليومية والجمل البسيطة مع كتاب English for Palestine 4. الدروس ممتعة وقصيرة ومليئة بالتدريب على التحدث.',
  },
  accent: 'wine',
  children: [
    {
      id: 'semester-1',
      name: { en: 'Semester 1', ar: 'الفصل الأول' },
      description: { en: 'English for Palestine 4A — book, solutions and the units of the first semester.', ar: 'English for Palestine 4A — الكتاب والحلول ووحدات الفصل الأول.' },
      icon: 'CalendarDays',
      children: [
        {
          id: 'student-book',
          name: { en: 'Student Book', ar: 'الكتاب' },
          description: { en: 'English for Palestine 4A — read online or download.', ar: 'كتاب English for Palestine 4A — للقراءة أو التحميل.' },
          icon: 'BookOpen',
          items: [
            { id: 'g4-book-4a', title: { en: 'English for Palestine 4A — Student Book', ar: 'كتاب الطالب English for Palestine 4A' }, type: 'pdf', file: `${R}/student-book/english-for-palestine-4-semester-1.pdf`, thumbnail: `${R}/student-book/cover.png`, pages: 64 },
          ],
        },
        {
          id: 'book-solutions',
          name: { en: 'Book Solutions', ar: 'حلول الكتاب' },
          description: { en: 'Answer key for the 4A student book.', ar: 'حلول كتاب الطالب 4A.' },
          icon: 'BookCheck',
          items: [
            { id: 'g4-sol-4a', title: { en: 'English for Palestine 4A — Solutions', ar: 'حلول كتاب English for Palestine 4A' }, type: 'pdf', file: `${R}/book-solutions/english-for-palestine-4-semester-1-solutions.pdf`, thumbnail: `${R}/book-solutions/cover.png`, pages: 64 },
          ],
        },
        {
          id: 'unit-1',
          name: { en: 'Unit 1 — A New Friend', ar: 'الوحدة الأولى — صديق جديد' },
          description: { en: 'Family members, jobs and introducing people.', ar: 'أفراد الأسرة، المهن، والتعريف بالأشخاص.' },
          icon: 'Users',
          children: [
            {
              id: 'assessment',
              name: { en: 'Student Assessment', ar: 'أساس تقييم الطالب' },
              description: { en: 'Performance task (GRASPS) and rubric.', ar: 'مهمة الأداء (GRASPS) ومعايير التقييم.' },
              icon: 'ClipboardCheck',
              items: [
                { id: 'g4-u1-grasps', title: { en: 'GRASPS Task: "A New Friend" — with rubric', ar: 'مهمة GRASPS: "صديق جديد" — مع معايير التقييم' }, type: 'docx', file: `${R}/unit-1/assessment/unit-1-a-new-friend-grasps-rubric.docx`, preview: `${R}/unit-1/assessment/unit-1-a-new-friend-grasps-rubric.pdf` },
              ],
            },
            {
              id: 'games',
              name: { en: 'Interactive Games', ar: 'ألعاب تفاعلية' },
              description: { en: 'Games to practise the unit vocabulary.', ar: 'ألعاب للتدريب على مفردات الوحدة.' },
              icon: 'Gamepad2',
              items: [
                { id: 'g4-u1-game-jobs', title: { en: 'Interactive game: Jobs', ar: 'لعبة تفاعلية عن المهن' }, description: { en: 'Wordwall game — play here or open on Wordwall.', ar: 'لعبة Wordwall — العب هنا أو افتحها على Wordwall.' }, type: 'wordwall', url: 'https://wordwall.net/resource/118215930?wwmethod=link' },
              ],
            },
            {
              id: 'posters',
              name: { en: 'Posters', ar: 'بوسترات' },
              description: { en: 'Posters, question sheets and the dialogue picture.', ar: 'بوسترات وأوراق أسئلة وصورة الحوار.' },
              icon: 'Image',
              items: [
                { id: 'g4-u1-p1', title: { en: 'Jobs poster', ar: 'بوستر المهن' }, type: 'pdf', file: `${R}/unit-1/posters/unit-1-jobs-poster.pdf`, thumbnail: `${R}/unit-1/posters/unit-1-jobs-poster-thumb.png` },
                { id: 'g4-u1-p2', title: { en: 'Questions on the jobs poster', ar: 'أسئلة على بوستر المهن' }, type: 'image', file: `${R}/unit-1/posters/unit-1-jobs-poster-questions.png` },
                { id: 'g4-u1-p3', title: { en: 'Family members poster', ar: 'بوستر أفراد الأسرة' }, type: 'image', file: `${R}/unit-1/posters/unit-1-family-members-poster.png` },
                { id: 'g4-u1-p4', title: { en: 'Introducing people & questions about them', ar: 'تعريف بالأشخاص وأسئلة عنهم' }, type: 'pdf', file: `${R}/unit-1/posters/unit-1-introducing-people.pdf`, thumbnail: `${R}/unit-1/posters/unit-1-introducing-people-thumb.png` },
                { id: 'g4-u1-p5', title: { en: 'The dialogue picture', ar: 'صورة الحوار' }, type: 'image', file: `${R}/unit-1/posters/unit-1-dialogue-picture.jpg` },
              ],
            },
            {
              id: 'videos',
              name: { en: 'Videos', ar: 'فيديوهات' },
              description: { en: 'The dialogue video plus YouTube and Facebook links.', ar: 'فيديو الحوار مع روابط يوتيوب وفيسبوك.' },
              icon: 'Clapperboard',
              items: [
                { id: 'g4-u1-v1', title: { en: 'The dialogue video', ar: 'فيديو الحوار' }, type: 'video', file: `${R}/unit-1/videos/unit-1-dialogue.mp4`, thumbnail: `${R}/unit-1/videos/unit-1-dialogue-thumb.jpg`, duration: '0:20' },
                { id: 'g4-u1-v2', title: { en: 'Colours video', ar: 'فيديو الألوان' }, type: 'youtube', youtubeId: 'k7npO4Hc8vA' },
                { id: 'g4-u1-v3', title: { en: 'Brothers & sisters video', ar: 'فيديو الإخوة' }, type: 'youtube', youtubeId: 'bkAhvmRyCwc' },
                { id: 'g4-u1-v4', title: { en: 'The new student video', ar: 'فيديو الطالبة الجديدة' }, type: 'youtube', youtubeId: '2mzsa8GdrUQ' },
                { id: 'g4-u1-v5', title: { en: 'Colours video (Facebook)', ar: 'فيديو الألوان (فيسبوك)' }, type: 'facebook', url: 'https://www.facebook.com/reel/2184659362116870' },
                { id: 'g4-u1-v6', title: { en: 'Family video (Facebook)', ar: 'فيديو العائلة (فيسبوك)' }, type: 'facebook', url: 'https://www.facebook.com/reel/1545079240635484' },
              ],
            },
          ],
        },
        {
          id: 'unit-2',
          name: { en: 'Unit 2 — Our House', ar: 'الوحدة الثانية — بيتنا' },
          description: { en: 'Rooms of the house and "Where is everyone?"', ar: 'غرف البيت و"أين الجميع؟"' },
          icon: 'House',
          children: [
            {
              id: 'assessment',
              name: { en: 'Student Assessment', ar: 'أساس تقييم الطالب' },
              description: { en: 'Performance task (GRASPS) and rubric.', ar: 'مهمة الأداء (GRASPS) ومعايير التقييم.' },
              icon: 'ClipboardCheck',
              items: [
                { id: 'g4-u2-grasps', title: { en: 'GRASPS Task: "Our House" — with rubric', ar: 'مهمة GRASPS: "بيتنا" — مع معايير التقييم' }, type: 'docx', file: `${R}/unit-2/assessment/unit-2-our-house-grasps-rubric.docx`, preview: `${R}/unit-2/assessment/unit-2-our-house-grasps-rubric.pdf` },
              ],
            },
            {
              id: 'videos',
              name: { en: 'Videos', ar: 'فيديوهات' },
              description: { en: '"Where is everyone?" video and the family tree video.', ar: 'فيديو "أين الجميع؟" وفيديو شجرة العائلة.' },
              icon: 'Clapperboard',
              items: [
                { id: 'g4-u2-v1', title: { en: '"Where is everyone?" video', ar: 'فيديو "أين الجميع؟"' }, type: 'video', file: `${R}/unit-2/videos/unit-2-where-is-everyone.mp4`, thumbnail: `${R}/unit-2/videos/unit-2-where-is-everyone-thumb.jpg`, duration: '1:10' },
                { id: 'g4-u2-v2', title: { en: 'Family tree video', ar: 'فيديو شجرة العائلة' }, type: 'youtube', youtubeId: 'RNBGPIx6j3o' },
              ],
            },
            {
              id: 'worksheets',
              name: { en: 'Worksheets', ar: 'أوراق عمل' },
              description: { en: 'Printable practice for the unit.', ar: 'تدريبات قابلة للطباعة للوحدة.' },
              icon: 'FileText',
              items: [
                { id: 'g4-u2-ws1', title: { en: 'Worksheet: Our House', ar: 'ورقة عمل: بيتنا' }, type: 'pdf', file: `${R}/unit-2/worksheets/unit-2-our-house-worksheet.pdf`, thumbnail: `${R}/unit-2/worksheets/unit-2-our-house-worksheet-thumb.png` },
              ],
            },
            {
              id: 'posters',
              name: { en: 'Posters', ar: 'بوسترات' },
              description: { en: 'Our House posters and the "Where is everyone?" sheet.', ar: 'بوسترات بيتنا وورقة "أين الجميع؟"' },
              icon: 'Image',
              items: [
                { id: 'g4-u2-p1', title: { en: 'Our House poster 1', ar: 'بوستر بيتنا 1' }, type: 'image', file: `${R}/unit-2/posters/unit-2-our-house-poster-1.jpg` },
                { id: 'g4-u2-p2', title: { en: 'Our House poster 2', ar: 'بوستر بيتنا 2' }, type: 'image', file: `${R}/unit-2/posters/unit-2-our-house-poster-2.jpg` },
                { id: 'g4-u2-p3', title: { en: 'Our House poster 3', ar: 'بوستر بيتنا 3' }, type: 'image', file: `${R}/unit-2/posters/unit-2-our-house-poster-3.jpg` },
                { id: 'g4-u2-p4', title: { en: 'Worksheet: Where is everyone?', ar: 'ورقة عمل: أين الجميع؟' }, type: 'image', file: `${R}/unit-2/posters/unit-2-where-is-everyone-worksheet.png` },
              ],
            },
          ],
        },
        {
          id: 'unit-3',
          name: { en: 'Unit 3 — Lost!', ar: 'الوحدة الثالثة — ضائع!' },
          description: { en: 'Items around the house, prepositions and possessive adjectives.', ar: 'أغراض المنزل، وحروف الجر، والضمائر الملكية.' },
          icon: 'Puzzle',
          children: [
            {
              id: 'games',
              name: { en: 'Interactive Games', ar: 'ألعاب تفاعلية' },
              description: { en: 'Match subject pronouns with possessive adjectives.', ar: 'طابق الضمائر الفاعلة مع الضمائر الملكية.' },
              icon: 'Gamepad2',
              items: [
                { id: 'g4-u3-game-1', title: { en: 'Match & Learn: Subject Pronouns & Possessive Adjectives', ar: 'طابق وتعلم: الضمائر الفاعلة والملكية' }, type: 'image', file: `${R}/unit-3/games/unit-3-match-and-learn-game.jpg` },
                { id: 'g4-u3-game-2', title: { en: 'Match & Move: Subject Pronouns & Possessive Adjectives', ar: 'طابق وحرك: الضمائر الفاعلة والملكية' }, type: 'image', file: `${R}/unit-3/games/unit-3-match-and-move-game.jpg` },
              ],
            },
            {
              id: 'posters',
              name: { en: 'Posters', ar: 'بوسترات' },
              description: { en: 'House vocabulary, prepositions and possessive adjectives.', ar: 'مفردات المنزل وحروف الجر والضمائر الملكية.' },
              icon: 'Image',
              items: [
                { id: 'g4-u3-p1', title: { en: 'Bedroom poster — Where\'s my bag?', ar: 'بوستر غرفة النوم — أين حقيبتي؟' }, type: 'image', file: `${R}/unit-3/posters/unit-3-bedroom-poster.png` },
                { id: 'g4-u3-p2', title: { en: 'Living room vocabulary poster', ar: 'بوستر مفردات غرفة الجلوس' }, type: 'image', file: `${R}/unit-3/posters/unit-3-living-room-vocabulary-poster.jpg` },
                { id: 'g4-u3-p3', title: { en: 'Fill the gap poster', ar: 'بوستر أكمل الفراغ' }, type: 'image', file: `${R}/unit-3/posters/unit-3-fill-the-gap-poster.jpg` },
                { id: 'g4-u3-p4', title: { en: 'Learning prepositions with Timmy the cat', ar: 'تعلم حروف الجر مع القط تيمي' }, type: 'image', file: `${R}/unit-3/posters/unit-3-prepositions-poster.jpg` },
                { id: 'g4-u3-p5', title: { en: 'Who owns it? Subject pronouns & possessive adjectives', ar: 'لمن هذا؟ الضمائر الفاعلة والملكية' }, type: 'image', file: `${R}/unit-3/posters/unit-3-who-owns-it-poster.jpg` },
              ],
            },
            {
              id: 'videos',
              name: { en: 'Videos', ar: 'فيديوهات' },
              description: { en: '"Where\'s my bag?" and a room search video.', ar: 'فيديو "أين حقيبتي؟" وفيديو البحث في الغرفة.' },
              icon: 'Clapperboard',
              items: [
                { id: 'g4-u3-v1', title: { en: 'Where\'s my bag? — bedroom lesson video', ar: 'أين حقيبتي؟ — فيديو درس غرفة النوم' }, type: 'video', file: `${R}/unit-3/videos/unit-3-wheres-my-bag-video.mp4`, thumbnail: `${R}/unit-3/videos/unit-3-wheres-my-bag-video-thumb.jpg`, duration: '0:47' },
                { id: 'g4-u3-v2', title: { en: 'Room search — find the object', ar: 'ابحث في الغرفة — أوجد الغرض' }, type: 'video', file: `${R}/unit-3/videos/unit-3-room-search-video.mp4`, thumbnail: `${R}/unit-3/videos/unit-3-room-search-video-thumb.jpg`, duration: '0:58' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'facebook-group',
      name: { en: 'Grade 4 English Club', ar: 'نادي اللغة الإنجليزية — الصف الرابع' },
      description: { en: 'Private Facebook group for Grade 4 students, part of the school English Club. Opens in a new tab.', ar: 'مجموعة فيسبوك خاصة لطالبات الصف الرابع، ضمن نادي اللغة الإنجليزية في المدرسة. تُفتح في تبويب جديد.' },
      icon: 'Facebook',
      link: 'https://www.facebook.com/share/g/1DRWdMziSJ/',
      badge: { en: 'Facebook group', ar: 'مجموعة فيسبوك' },
    },
    {
      id: 'audio-drive',
      name: { en: 'Audio Materials', ar: 'المادة السمعية' },
      description: { en: 'Listening tracks for the English for Palestine 4 book, on Google Drive. Opens in a new tab.', ar: 'المقاطع الصوتية لكتاب English for Palestine 4 على Google Drive. تُفتح في تبويب جديد.' },
      icon: 'Headphones',
      link: 'https://drive.google.com/drive/folders/1lz9rb9onkB3kugtO_t3OqtQ9Sv3JeVIZ',
      badge: { en: 'Google Drive', ar: 'Google Drive' },
    },
  ],
}

// ── Grade 6 / Grade 7 — waiting for material ──────────────────
const emptyGrade = (id, number, name, tagline, description, accent) => ({
  id, number, name, tagline, description, accent,
  children: [
    {
      id: 'semester-1',
      name: { en: 'Semester 1', ar: 'الفصل الأول' },
      description: { en: 'Materials for the first semester will appear here.', ar: 'ستظهر مواد الفصل الأول هنا.' },
      icon: 'CalendarDays',
      children: [],
      items: [],
    },
  ],
})

const grade6 = emptyGrade('grade-6', 6,
  { en: 'Grade 6', ar: 'الصف السادس' },
  { en: 'Reading deeper, writing clearer.', ar: 'قراءة أعمق، وكتابة أوضح.' },
  { en: 'Paragraph writing, past and future tenses, longer reading passages and real conversations about ideas.', ar: 'كتابة الفقرات، الأزمنة الماضية والمستقبلية، نصوص قراءة أطول، ومحادثات حقيقية حول الأفكار.' },
  'green')

const grade7 = emptyGrade('grade-7', 7,
  { en: 'Grade 7', ar: 'الصف السابع' },
  { en: 'Thinking, arguing and telling stories in English.', ar: 'التفكير والنقاش ورواية القصص بالإنجليزية.' },
  { en: 'Essay structure, reported speech, richer vocabulary and reading real texts — news, letters and short fiction.', ar: 'بنية المقال، الكلام المنقول، مفردات أغنى، وقراءة نصوص حقيقية — أخبار ورسائل وقصص قصيرة.' },
  'blue')

export const grades = [grade4, grade6, grade7]

// ── helpers ───────────────────────────────────────────────────
export const getGrade = (id) => grades.find((g) => g.id === id)

/** Walk a grade's tree by path segments, e.g. ['semester-1','unit-1','posters']. Returns { node, trail } or null. */
export function resolvePath(grade, segments) {
  let node = grade
  const trail = [grade]
  for (const seg of segments) {
    const next = (node.children || []).find((c) => c.id === seg)
    if (!next) return null
    node = next
    trail.push(node)
  }
  return { node, trail }
}

/** Count every item beneath a node. */
export const countItems = (node) =>
  (node.items?.length || 0) + (node.children || []).reduce((n, c) => n + countItems(c), 0)

export const countAllItems = (list = grades) => list.reduce((n, g) => n + countItems(g), 0)

/** Flat list of every item with its grade + folder trail — used by global search. */
export function allItems(list = grades) {
  const out = []
  const walk = (grade, node, path, trail) => {
    for (const it of node.items || []) out.push({ ...it, gradeId: grade.id, gradeName: grade.name, path, trail })
    for (const c of node.children || []) walk(grade, c, [...path, c.id], [...trail, c])
  }
  for (const g of list) walk(g, g, [], [])
  return out
}
