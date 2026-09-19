// ─────────────────────────────────────────────────────────────
//  SITE & TEACHER INFORMATION  (bilingual: { en, ar })
//  Edit this file to change the teacher's name, school, photo, bio…
// ─────────────────────────────────────────────────────────────

// Teacher mode (adding material from the website).
// This passcode is only used while NO cloud project is connected (uploads then
// stay on the teacher's own device). Once Supabase is connected the teacher
// signs in with her real e-mail + password instead and this is ignored.
export const teacherAccess = { passcode: '2026' }

export const teacher = {
  name: { en: 'Mrs Rana', ar: 'المعلمة رنا' },
  title: { en: 'English Language Teacher', ar: 'معلمة لغة إنجليزية' },
  school: { en: 'Deer AL-Ghusoon School', ar: 'مدرسة دير الغصون' },
  // Photo shown on the About page — replace /public/teacher.jpg
  photo: '/teacher.jpg',
  email: 'rtyuqwer1235@gmail.com',
  yearsTeaching: '23+',
  intro: {
    en: 'Welcome to my classroom online. Everything we use with the English for Palestine book — the student book, solutions, assessment tasks, games, posters and videos — organised exactly the way I organise it in class, so students and colleagues can always find what they need.',
    ar: 'أهلاً بكم في صفي الإلكتروني. كل ما نستخدمه مع كتاب English for Palestine — كتاب الطالب والحلول ومهام التقييم والألعاب والبوسترات والفيديوهات — مرتّب تماماً كما أرتّبه في الصف، ليجد الطلاب والزملاء ما يحتاجونه دائماً.',
  },
  bio: {
    en: [
      'I am Mrs Rana, an English language teacher at Deer AL-Ghusoon School with more than 23 years in the classroom. I currently teach Grades 4, 6 and 7 using the English for Palestine series, and I still walk into every lesson with the same excitement I had in my first year.',
      'My passion is watching a shy student find the courage to speak, or a reluctant reader finish a story on their own. I believe English is learned through curiosity and practice, not fear of mistakes — so my classes are full of games, posters, songs, short videos and real conversation.',
      'I built this website to keep everything we use in one place: the student book and its solutions, assessment tasks, interactive games, posters and videos for every unit — organised by semester and unit, just like my own folders. Students can revisit a lesson at home, parents can follow what we are learning, and colleagues are welcome to reuse anything they find useful.',
    ],
    ar: [
      'أنا المعلمة رنا، معلمة لغة إنجليزية في مدرسة دير الغصون، وخبرتي في التدريس تزيد عن 23 عاماً. أدرّس حالياً الصفوف الرابع والسادس والسابع باستخدام سلسلة English for Palestine، وما زلت أدخل كل حصة بالحماس نفسه الذي كان معي في سنتي الأولى.',
      'شغفي هو أن أرى طالبة خجولة تجد الشجاعة لتتكلم، أو طالبة تتردد في القراءة تُنهي قصة بنفسها. أؤمن أن الإنجليزية تُتعلَّم بالفضول والممارسة لا بالخوف من الخطأ — لذلك حصصي مليئة بالألعاب والبوسترات والأغاني والفيديوهات القصيرة والمحادثة الحقيقية.',
      'أنشأت هذا الموقع ليجمع كل ما نستخدمه في مكان واحد: كتاب الطالب وحلوله، مهام التقييم، الألعاب التفاعلية، البوسترات والفيديوهات لكل وحدة — مرتّبة حسب الفصل والوحدة تماماً كما في مجلداتي. يستطيع الطلاب مراجعة الدرس في البيت، ويتابع الأهل ما نتعلمه، ويسعدني أن يستفيد الزملاء من أي شيء يجدونه مفيداً.',
    ],
  },
  philosophy: [
    { title: { en: 'Read every day', ar: 'اقرأ كل يوم' }, text: { en: 'Ten minutes with a good story does more than an hour of drills.', ar: 'عشر دقائق مع قصة جيدة تفعل أكثر من ساعة تدريبات.' } },
    { title: { en: 'Mistakes are practice', ar: 'الأخطاء تدريب' }, text: { en: 'Speaking imperfectly is the only way to speak well later.', ar: 'التحدث بأخطاء هو الطريق الوحيد للتحدث جيداً لاحقاً.' } },
    { title: { en: 'Learning should feel like play', ar: 'التعلّم يجب أن يشبه اللعب' }, text: { en: 'Games, posters and videos make new words stick.', ar: 'الألعاب والبوسترات والفيديوهات تُثبّت الكلمات الجديدة.' } },
    { title: { en: 'Every learner is seen', ar: 'كل طالبة مرئية' }, text: { en: 'Clear goals, honest feedback and a kind word for each student.', ar: 'أهداف واضحة وتغذية راجعة صادقة وكلمة طيبة لكل طالبة.' } },
  ],
}

export const book = {
  title: 'English for Palestine',
  description: { en: 'The student book used in Grades 4, 6 and 7.', ar: 'كتاب الطالب المستخدم في الصفوف الرابع والسادس والسابع.' },
}

export const siteMeta = {
  name: 'English for Palestine',
  heroImage: '/hero-classroom.jpg', // replace with any image in /public
  year: new Date().getFullYear(),
}

export const nav = [
  { to: '/', key: 'home' },
  { to: '/classes', key: 'classes' },
  { to: '/resources', key: 'resources' },
  { to: '/about', key: 'about' },
]
