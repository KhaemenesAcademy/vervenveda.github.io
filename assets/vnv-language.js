/* Verve N Veda 13-language public interface layer.
 * Curated translations are private/offline. An installed browser translation model
 * can finish public UI; MyMemory is never contacted without explicit confirmation.
 * Page-local learner responses and admin inputs are excluded from remote translation.
 * Content remains English when no verified translation is available. */
(()=>{"use strict";
const CODES=["en","es","fr","ar","zh","de","ru","pt","hi","ja","ko","it","bn"];
const ROWS=[["Explore","Explorar","Explorer","استكشف","探索","Entdecken","Исследовать"],["Halls","Salas","Salles","القاعات","展馆","Hallen","Залы"],["Matrix","Matriz","Matrice","المصفوفة","矩阵","Matrix","Матрица"],["Civic","Cívica","Civique","المدنية","公民","Bürgerwesen","Гражданское"],["Promise","Compromiso","Engagement","الوعد","承诺","Versprechen","Обещание"],["Donate","Donar","Faire un don","تبرع","捐助","Spenden","Пожертвовать"],["News","Noticias","Actualités","الأخبار","新闻","Nachrichten","Новости"],["Weather","Clima","Météo","الطقس","天气","Wetter","Погода"],["Creative","Creatividad","Créativité","الإبداع","创意","Kreatives","Творчество"],["Professional","Profesional","Professionnel","المهني","专业","Berufliches","Профессиональное"],["Education","Educación","Éducation","التعليم","教育","Bildung","Образование"],["Games","Juegos","Jeux","الألعاب","游戏","Spiele","Игры"],["Earth","Tierra","Terre","الأرض","地球","Erde","Земля"],["Health","Salud","Santé","الصحة","健康","Gesundheit","Здоровье"],["Connect","Conectar","Connexion","تواصل","连接","Verbinden","Связь"],["Finance","Finanzas","Finance","المالية","金融","Finanzen","Финансы"],["Research","Investigación","Recherche","البحث","研究","Forschung","Исследования"],["Knowledge","Conocimiento","Connaissances","المعرفة","知识","Wissen","Знания"],["Public Service","Servicio público","Service public","الخدمة العامة","公共服务","Öffentlicher Dienst","Общественная служба"],["Creative & Professional","Creativo y profesional","Créativité et métiers","الإبداع والمهن","创意与专业","Kreatives und Berufliches","Творчество и профессии"],["Gateways","Portales","Portails","البوابات","门户","Portale","Порталы"],["Pages","Páginas","Pages","الصفحات","页面","Seiten","Страницы"],["Apps","Aplicaciones","Applications","التطبيقات","应用","Apps","Приложения"],["Tools","Herramientas","Outils","الأدوات","工具","Werkzeuge","Инструменты"],["Courses","Cursos","Cours","الدورات","课程","Kurse","Курсы"],["Resources","Recursos","Ressources","الموارد","资源","Ressourcen","Ресурсы"],["Portals","Portales","Portails","البوابات","门户","Portale","Порталы"],["Workshops","Talleres","Ateliers","ورش العمل","工作坊","Workshops","Мастер-классы"],["Studios","Estudios","Studios","الاستوديوهات","工作室","Studios","Студии"],["Assessments","Evaluaciones","Évaluations","التقييمات","测评","Bewertungen","Оценивания"],["Mentors & Guides","Mentores y guías","Mentors et guides","الموجهون والمرشدون","导师与指南","Mentoren und Begleiter","Наставники и гиды"],["Explore the Ecosystem","Explorar el ecosistema","Explorer l'écosystème","استكشف المنظومة","探索生态系统","Ökosystem entdecken","Исследовать экосистему"],["Discover the Halls","Descubrir las salas","Découvrir les salles","اكتشف القاعات","发现各展馆","Hallen entdecken","Открыть залы"],["Open 333 Network","Abrir la red 333","Ouvrir le réseau 333","افتح شبكة 333","打开 333 网络","333-Netzwerk öffnen","Открыть сеть 333"],["Scroll to Explore","Desplázate para explorar","Défiler pour explorer","مرّر للاستكشاف","滚动探索","Zum Entdecken scrollen","Листайте для знакомства"],["Featured Sites","Sitios destacados","Sites à découvrir","المواقع المميزة","精选网站","Ausgewählte Seiten","Избранные сайты"],["Choose a doorway or browse its complete resources.","Elige una entrada o explora todos sus recursos.","Choisissez un portail ou parcourez toutes ses ressources.","اختر بوابة أو تصفح مواردها الكاملة.","选择入口或浏览全部资源。","Wählen Sie einen Zugang oder erkunden Sie alle Ressourcen.","Выберите раздел или изучите все его ресурсы."],["The Four Great Halls","Las cuatro grandes salas","Les quatre grandes salles","القاعات الأربع الكبرى","四大展馆","Die vier großen Hallen","Четыре главных зала"],["Many public resources. One organized home.","Muchos recursos públicos. Un espacio organizado.","De nombreuses ressources publiques. Un espace organisé.","موارد عامة كثيرة في مكان واحد منظم.","众多公共资源，汇于一处。","Viele öffentliche Ressourcen. Ein geordnetes Zuhause.","Множество открытых ресурсов. Единая система."],["Featured Public Destinations","Destinos públicos destacados","Destinations publiques à découvrir","وجهات عامة مميزة","精选公共站点","Ausgewählte öffentliche Angebote","Избранные общественные ресурсы"],["Featured across Verve N Veda","Destacado en Verve N Veda","À découvrir dans Verve N Veda","مميز عبر فيرف إن فيدا","Verve N Veda 精选","Vorgestellt bei Verve N Veda","Рекомендуем в Verve N Veda"],["Discover the ecosystem","Descubre el ecosistema","Découvrez l'écosystème","اكتشف المنظومة","发现生态系统","Entdecken Sie das Ökosystem","Откройте экосистему"],["Open in ecosystem viewer","Abrir en el visor","Ouvrir dans la visionneuse","افتح في عارض المنظومة","在站点查看器中打开","Im Ökosystem-Betrachter öffnen","Открыть в просмотрщике"],["Pause","Pausar","Pause","إيقاف مؤقت","暂停","Pause","Пауза"],["Resume","Reanudar","Reprendre","استئناف","继续","Fortsetzen","Продолжить"],["Print","Imprimir","Imprimer","طباعة","打印","Drucken","Печать"],["Verve N Veda Directory","Directorio Verve N Veda","Annuaire Verve N Veda","دليل فيرف إن فيدا","Verve N Veda 目录","Verve N Veda Verzeichnis","Каталог Verve N Veda"],["Search the complete directory","Buscar en el directorio completo","Rechercher dans tout l'annuaire","ابحث في الدليل الكامل","搜索完整目录","Gesamtes Verzeichnis durchsuchen","Поиск по всему каталогу"],["Search education, law, weather, art, veterans…","Buscar educación, derecho, clima, arte, veteranos…","Rechercher éducation, droit, météo, art, anciens combattants…","ابحث عن التعليم والقانون والطقس والفن والمحاربين القدامى…","搜索教育、法律、天气、艺术、退伍军人…","Bildung, Recht, Wetter, Kunst, Veteranen suchen…","Поиск: образование, право, погода, искусство, ветераны…"],["The Verve N Veda Promise","El compromiso de Verve N Veda","L'engagement de Verve N Veda","وعد فيرف إن فيدا","Verve N Veda 的承诺","Das Verve N Veda Versprechen","Обещание Verve N Veda"],["Welcome Home","Bienvenidos","Bienvenue","أهلاً بكم","欢迎","Willkommen","Добро пожаловать"],["Support Independent Creation","Apoya la creación independiente","Soutenir la création indépendante","ادعم الإبداع المستقل","支持独立创作","Unabhängige Kreativität unterstützen","Поддержать независимое творчество"],["Accounts","Cuentas","Comptes","الحسابات","账户","Konten","Аккаунты"],["Find My School","Encontrar mi escuela","Trouver mon école","ابحث عن مدرستي","寻找学校","Meine Schule finden","Найти школу"],["Academy Services","Servicios de la Academia","Services de l'Académie","خدمات الأكاديمية","学院服务","Akademie-Dienste","Услуги Академии"],["Beta Program","Programa beta","Programme bêta","البرنامج التجريبي","测试计划","Beta-Programm","Бета-программа"],["Help Desk","Centro de ayuda","Centre d'aide","مركز المساعدة","帮助中心","Hilfezentrum","Служба помощи"],["Front Desk","Recepción","Accueil","الاستقبال","服务台","Empfang","Приёмная"],["Schools","Escuelas","Écoles","المدارس","学校","Schulen","Школы"],["Services","Servicios","Services","الخدمات","服务","Dienste","Услуги"],["Beta","Beta","Bêta","تجريبي","测试版","Beta","Бета"],["Help","Ayuda","Aide","مساعدة","帮助","Hilfe","Помощь"],["Student Entry","Acceso de estudiantes","Accès élève","دخول الطالب","学生入口","Schülerzugang","Вход ученика"],["Create / Manage Account","Crear o gestionar cuenta","Créer ou gérer un compte","إنشاء أو إدارة حساب","创建或管理账户","Konto erstellen oder verwalten","Создать или управлять аккаунтом"],["What do you need today?","¿Qué necesitas hoy?","De quoi avez-vous besoin aujourd'hui ?","ما الذي تحتاجه اليوم؟","今天需要什么帮助？","Was brauchen Sie heute?","Что вам нужно сегодня?"],["One calm path through the front desk.","Un camino claro desde la recepción.","Un parcours serein depuis l'accueil.","مسار واضح عبر مكتب الاستقبال.","从服务台开始的清晰路径。","Ein klarer Weg durch den Empfang.","Понятный путь через приёмную."],["Go directly to the learning stage you need.","Ve directamente a la etapa educativa que necesitas.","Accédez directement au niveau d'études souhaité.","انتقل مباشرة إلى المرحلة التعليمية التي تحتاجها.","直达所需学习阶段。","Direkt zur passenden Lernstufe.","Перейдите сразу к нужной ступени обучения."],["Common questions, direct answers.","Preguntas frecuentes, respuestas claras.","Questions fréquentes, réponses directes.","أسئلة شائعة وإجابات مباشرة.","常见问题，直接解答。","Häufige Fragen, klare Antworten.","Частые вопросы, прямые ответы."],["Preschool","Preescolar","Maternelle","مرحلة ما قبل المدرسة","学前班","Vorschule","Дошкольное обучение"],["Kinder Garden","Jardín de infancia","Jardin d'enfants","رياض الأطفال","幼儿园","Kindergarten","Детский сад"],["Elementary","Primaria","École primaire","الابتدائية","小学","Grundschule","Начальная школа"],["Middle School","Escuela intermedia","Collège","المرحلة المتوسطة","初中","Mittelstufe","Средняя школа"],["High School","Secundaria superior","Lycée","المرحلة الثانوية","高中","Oberstufe","Старшая школа"],["Higher Learning","Educación superior","Enseignement supérieur","التعليم العالي","高等教育","Höhere Bildung","Высшее образование"],["Linguistics","Lingüística","Linguistique","اللغويات","语言学","Linguistik","Лингвистика"],["Student","Estudiante","Élève","طالب","学生","Lernende","Ученик"],["Family","Familia","Famille","الأسرة","家庭","Familie","Семья"],["Family / Parent","Familia / Padres","Famille / Parents","الأسرة / الوالدين","家庭／家长","Familie / Eltern","Семья / Родители"],["Teacher / Faculty","Docentes","Enseignants","المعلمون","教师","Lehrkräfte","Преподаватели"],["Adult Scholar","Estudiante adulto","Apprenant adulte","متعلم بالغ","成人学员","Erwachsene Lernende","Взрослый учащийся"],["Account","Cuenta","Compte","الحساب","账户","Konto","Аккаунт"],["School","Escuela","École","المدرسة","学校","Schule","Школа"],["Learning","Aprendizaje","Apprentissage","التعلم","学习","Lernen","Обучение"],["Records","Expedientes","Dossiers","السجلات","记录","Unterlagen","Документы"],["Academy Compass","Guía de la Academia","Boussole de l'Académie","بوصلة الأكاديمية","学院导航","Akademie-Kompass","Навигатор Академии"],["Open Student Portal","Abrir portal del estudiante","Ouvrir l'espace élève","افتح بوابة الطالب","打开学生门户","Schülerportal öffnen","Открыть портал ученика"],["Open Family Portal","Abrir portal familiar","Ouvrir l'espace famille","افتح بوابة الأسرة","打开家庭门户","Familienportal öffnen","Открыть семейный портал"],["Teacher Administration","Administración docente","Administration pédagogique","إدارة المعلمين","教师管理","Lehrerverwaltung","Управление преподавателями"],["Adult Learning","Aprendizaje para adultos","Formation des adultes","تعليم الكبار","成人学习","Erwachsenenbildung","Образование взрослых"],["Open Preschool","Abrir preescolar","Ouvrir la maternelle","افتح ما قبل المدرسة","打开学前班","Vorschule öffnen","Открыть дошкольное обучение"],["Open Kindergarten","Abrir jardín de infancia","Ouvrir le jardin d'enfants","افتح الروضة","打开幼儿园","Kindergarten öffnen","Открыть детский сад"],["Open Elementary","Abrir primaria","Ouvrir l'école primaire","افتح الابتدائية","打开小学","Grundschule öffnen","Открыть начальную школу"],["Open Middle School","Abrir escuela intermedia","Ouvrir le collège","افتح المرحلة المتوسطة","打开初中","Mittelstufe öffnen","Открыть среднюю школу"],["Open High School","Abrir secundaria","Ouvrir le lycée","افتح الثانوية","打开高中","Oberstufe öffnen","Открыть старшую школу"],["Open Higher Learning","Abrir educación superior","Ouvrir l'enseignement supérieur","افتح التعليم العالي","打开高等教育","Höhere Bildung öffnen","Открыть высшее образование"],["Open Linguistics","Abrir lingüística","Ouvrir linguistique","افتح اللغويات","打开语言学","Linguistik öffnen","Открыть лингвистику"],["Open Help Desk →","Abrir centro de ayuda →","Ouvrir l'aide →","افتح مركز المساعدة ←","打开帮助中心 →","Hilfe öffnen →","Открыть помощь →"],["Join Beta Testing →","Participar en pruebas beta →","Rejoindre le programme bêta →","انضم للاختبار التجريبي ←","加入测试 →","Am Betatest teilnehmen →","Участвовать в бета-тесте →"],["Placement & Pathways","Asignación y trayectorias","Placement et parcours","التسكين والمسارات","分班与学习路径","Einstufung und Lernwege","Распределение и траектории"],["Records & Reports","Expedientes e informes","Dossiers et rapports","السجلات والتقارير","记录与报告","Unterlagen und Berichte","Документы и отчёты"],["Help & Orientation","Ayuda y orientación","Aide et orientation","المساعدة والإرشاد","帮助与指引","Hilfe und Orientierung","Помощь и ориентация"],["Beta & Improvement","Pruebas y mejoras","Tests et améliorations","الاختبار والتحسين","测试与改进","Beta und Verbesserung","Тестирование и улучшения"]];
const POLYGLOT_ROWS=[["Language Apps","Aplicaciones de idiomas","Applications linguistiques","تطبيقات اللغات","语言应用","Sprach-Apps","Языковые приложения"],["Voice Studio","Estudio de voz","Studio vocal","استوديو الصوت","语音工作室","Sprachstudio","Голосовая студия"],["World Atlas","Atlas mundial","Atlas mondial","الأطلس العالمي","世界图集","Weltatlas","Мировой атлас"],["The World in Words","El mundo en palabras","Le monde en mots","العالم بالكلمات","语言中的世界","Die Welt in Worten","Мир в словах"],["Formal Academy","Academia formal","Académie des langues","الأكاديمية النظامية","正式学院","Sprachakademie","Языковая академия"],["Arabic Suite","Estudio de árabe","Atelier d'arabe","مجموعة العربية","阿拉伯语学习","Arabisch-Lernwelt","Арабский комплекс"],["German Studio","Estudio de alemán","Atelier d'allemand","استوديو الألمانية","德语工作室","Deutschstudio","Студия немецкого"],["Russian Studio","Estudio de ruso","Atelier de russe","استوديو الروسية","俄语工作室","Russischstudio","Студия русского"],["Language Tools","Herramientas lingüísticas","Outils linguistiques","أدوات اللغات","语言工具","Sprachwerkzeuge","Языковые инструменты"],["Enter Five-Language Academy","Entrar a la Academia de cinco idiomas","Entrer dans l'Académie des cinq langues","ادخل أكاديمية اللغات الخمس","进入五语学院","Fünf-Sprachen-Akademie öffnen","Войти в Академию пяти языков"],["Choose a voice","Elegir una voz","Choisir une voix","اختر صوتًا","选择语音","Stimme wählen","Выбрать голос"],["Begin with a greeting.","Comienza con un saludo.","Commencez par une salutation.","ابدأ بتحية.","从问候语开始。","Beginne mit einer Begrüßung.","Начните с приветствия."],["Hear phrase","Escuchar frase","Écouter la phrase","استمع للعبارة","播放短语","Satz anhören","Прослушать фразу"],["Next phrase","Siguiente frase","Phrase suivante","العبارة التالية","下一句","Nächster Satz","Следующая фраза"],["Formal Language Academy","Academia de idiomas","Académie des langues","أكاديمية اللغات","语言学院","Sprachakademie","Языковая академия"],["Open the Academy","Abrir la Academia","Ouvrir l'Académie","افتح الأكاديمية","打开学院","Akademie öffnen","Открыть Академию"],["Language Studios & Tools","Estudios y herramientas lingüísticas","Ateliers et outils linguistiques","استوديوهات وأدوات اللغات","语言工作室与工具","Sprachstudios und Werkzeuge","Языковые студии и инструменты"],["Clear","Limpiar","Effacer","مسح","清除","Löschen","Очистить"],["Hear practice text","Escuchar texto de práctica","Écouter le texte","استمع إلى نص التدريب","朗读练习文本","Übungstext anhören","Прослушать учебный текст"],["Stop speech","Detener audio","Arrêter la lecture","أوقف النطق","停止朗读","Sprachausgabe stoppen","Остановить речь"],["Use browser default","Usar voz predeterminada","Utiliser la voix par défaut","استخدم الصوت الافتراضي","使用浏览器默认语音","Browserstandard verwenden","По умолчанию"],["Listening","Comprensión auditiva","Écoute","الاستماع","听力","Hören","Аудирование"],["Speaking","Expresión oral","Expression orale","التحدث","口语","Sprechen","Говорение"],["Reading","Lectura","Lecture","القراءة","阅读","Lesen","Чтение"],["Writing","Escritura","Écriture","الكتابة","写作","Schreiben","Письмо"],["Mediation","Mediación","Médiation","الوساطة اللغوية","语言调解","Sprachmittlung","Медиация"],["Translation","Traducción","Traduction","الترجمة","翻译","Übersetzung","Перевод"],["Culture","Cultura","Culture","الثقافة","文化","Kultur","Культура"],["Formal Study","Estudios formales","Études structurées","الدراسة النظامية","正式学习","Formales Lernen","Формальное обучение"],["Local Studios","Estudios locales","Ateliers locaux","استوديوهات محلية","本地工作室","Lokale Studios","Локальные студии"],["Campus & Support","Campus y ayuda","Campus et assistance","الحرم والدعم","校园与支持","Campus und Hilfe","Кампус и поддержка"],["Return to Top","Volver arriba","Retour en haut","العودة للأعلى","返回顶部","Nach oben","Наверх"],["Connected Learning Matrix","Red de aprendizaje conectado","Réseau d'apprentissage connecté","شبكة التعلم المتصل","互联学习矩阵","Vernetzte Lernmatrix","Матрица взаимосвязанного обучения"],["Support Polyglot","Apoyar Polyglot","Soutenir Polyglot","ادعم بوليغلوت","支持 Polyglot","Polyglot unterstützen","Поддержать Polyglot"],["Open Academy","Abrir Academia","Ouvrir l'Académie","افتح الأكاديمية","打开学院","Akademie öffnen","Открыть Академию"],["Open Field Lab","Abrir laboratorio de campo","Ouvrir le laboratoire de terrain","افتح المختبر الميداني","打开实地实验室","Feldlabor öffnen","Открыть полевую лабораторию"],["Open PROSE","Abrir PROSE","Ouvrir PROSE","افتح PROSE","打开 PROSE","PROSE öffnen","Открыть PROSE"],["Open ARSHIF","Abrir ARSHIF","Ouvrir ARSHIF","افتح أرشيف","打开 ARSHIF","ARSHIF öffnen","Открыть ARSHIF"],["Switch color theme","Cambiar tema visual","Changer le thème","بدّل المظهر","切换主题","Farbschema wechseln","Сменить тему"],["Open navigation","Abrir navegación","Ouvrir la navigation","افتح التنقل","打开导航","Navigation öffnen","Открыть навигацию"],["Search language apps","Buscar aplicaciones de idiomas","Rechercher les applications","ابحث عن تطبيقات اللغات","搜索语言应用","Sprach-Apps suchen","Поиск языковых приложений"],["Language filter","Filtro de idioma","Filtre de langue","مرشح اللغة","语言筛选","Sprachfilter","Фильтр языка"],["Voice","Voz","Voix","الصوت","语音","Stimme","Голос"],["Practice text","Texto de práctica","Texte d'entraînement","نص التدريب","练习文本","Übungstext","Текст для практики"],["Speech rate","Velocidad de voz","Débit de parole","سرعة النطق","语速","Sprechtempo","Темп речи"],["Voice pitch","Tono de voz","Hauteur de voix","طبقة الصوت","音高","Tonhöhe","Высота голоса"],["All available languages","Todos los idiomas disponibles","Toutes les langues disponibles","جميع اللغات المتاحة","所有可用语言","Alle verfügbaren Sprachen","Все доступные языки"],["Browser default voice","Voz predeterminada","Voix par défaut","الصوت الافتراضي","浏览器默认语音","Browser-Standardstimme","Голос браузера по умолчанию"],["Primary navigation","Navegación principal","Navigation principale","التنقل الرئيسي","主导航","Hauptnavigation","Основная навигация"],["Quick access","Acceso rápido","Accès rapide","وصول سريع","快速访问","Schnellzugriff","Быстрый доступ"]];
for(const row of POLYGLOT_ROWS){if(!ROWS.some(existing=>existing[0]===row[0]))ROWS.push(row)}
const REVIEWED_PUBLIC_COPY={"One calm entrance to formal language study, linguistics, pronunciation, scripts, translation, cultural understanding and a growing library of local language applications—from first words through lower-division collegiate study.":{"es":"Un acceso sereno al estudio formal de idiomas, la lingüística, la pronunciación, los sistemas de escritura, la traducción, la comprensión cultural y una biblioteca creciente de aplicaciones locales, desde las primeras palabras hasta los estudios universitarios iniciales.","fr":"Une entrée sereine vers l'étude structurée des langues, la linguistique, la prononciation, les écritures, la traduction, la compréhension culturelle et une bibliothèque croissante d'applications locales, des premiers mots aux premières années d'études supérieures."},"Hear a phrase using voices already available in the learner's browser or operating system.":{"es":"Escucha una frase con las voces disponibles en el navegador o sistema operativo del estudiante.","fr":"Écoutez une phrase avec les voix déjà disponibles dans le navigateur ou le système de l'apprenant."},"Five complete pathways. Middle school through College 202.":{"es":"Cinco trayectorias completas. Desde secundaria básica hasta el nivel universitario 202.","fr":"Cinq parcours complets, du collège jusqu'au niveau universitaire 202."},"The Five-Language Academy is now the academic centerpiece of this Linguistics repository. Its 206-dossier World Language Atlas remains open beyond these five formal programs.":{"es":"La Academia de Cinco Idiomas es el núcleo académico de este repositorio de Lingüística. Su Atlas de Lenguas del Mundo, con 206 expedientes, sigue abierto más allá de estos cinco programas formales.","fr":"L'Académie des cinq langues constitue le cœur pédagogique de ce dépôt de linguistique. Son Atlas des langues du monde, riche de 206 dossiers, reste accessible au-delà de ces cinq programmes."},"Thirty local applications for focused study, practice, play, reference and exploration.":{"es":"Treinta aplicaciones locales para estudiar, practicar, jugar, consultar y explorar.","fr":"Trente applications locales pour étudier, s'exercer, jouer, consulter et explorer."},"Choose a browser voice, pace and pitch that support your practice.":{"es":"Elige una voz del navegador, una velocidad y un tono adecuados para practicar.","fr":"Choisissez une voix du navigateur, une vitesse et une hauteur adaptées à vos exercices."},"No voice recordings are collected or uploaded. The page stores only the selected voice name, language filter, rate and pitch in this browser.":{"es":"No se recopilan ni suben grabaciones de voz. Esta página solo guarda en el navegador el nombre de la voz, el filtro de idioma, la velocidad y el tono seleccionados.","fr":"Aucun enregistrement vocal n'est collecté ni téléversé. La page conserve uniquement dans ce navigateur le nom de la voix choisie, le filtre de langue, le débit et la hauteur."},"The formal Academy begins with five pathways; the archive remains open to 206 language dossiers.":{"es":"La Academia formal comienza con cinco trayectorias; el archivo mantiene disponibles 206 expedientes lingüísticos.","fr":"L'Académie formelle commence par cinq parcours; les archives restent ouvertes à 206 dossiers linguistiques."},"Language study can move naturally into research, writing, experiential learning and the wider Academy.":{"es":"El aprendizaje de idiomas puede continuar de forma natural hacia la investigación, la escritura, el aprendizaje práctico y el resto de la Academia.","fr":"L'étude des langues peut se prolonger naturellement par la recherche, l'écriture, l'apprentissage pratique et les autres espaces de l'Académie."},"Return to the central campus, student and family pathways.":{"es":"Vuelve al campus central y a los recorridos para estudiantes y familias.","fr":"Retournez au campus central et aux parcours pour les élèves et les familles."},"Think of this page as the Academy front desk. Create or resume an account, find the right school or grade, enter student and family portals, reach teacher administration, join the beta program, or simply explore the Academy.":{"es":"Piensa en esta página como la recepción de la Academia. Crea o retoma una cuenta, encuentra la escuela o el grado adecuado, entra en los portales de estudiantes y familias, accede a la administración docente, participa en el programa beta o simplemente explora la Academia.","fr":"Considérez cette page comme l'accueil de l'Académie. Créez ou reprenez un compte, trouvez l'école ou le niveau adapté, accédez aux portails élèves et familles, à l'administration pédagogique, au programme bêta, ou explorez simplement l'Académie."},"Choose the doorway that matches your role. You should not need to understand the Academy's internal architecture just to get where you are going.":{"es":"Elige el acceso correspondiente a tu función. No necesitas conocer la estructura interna de la Academia para llegar a tu destino.","fr":"Choisissez l'entrée correspondant à votre rôle. Vous n'avez pas besoin de comprendre l'organisation interne de l'Académie pour trouver votre chemin."},"All campuses remain publicly browsable. Formal enrollment and placement are handled through the appropriate learner/family account.":{"es":"Todos los campus pueden explorarse públicamente. La inscripción y la asignación de nivel se gestionan mediante la cuenta correspondiente del estudiante o la familia.","fr":"Tous les campus restent accessibles à la consultation publique. L'inscription et le placement officiel passent par le compte élève ou famille approprié."},"Common questions, direct answers.":{"es":"Preguntas frecuentes, respuestas claras.","fr":"Questions fréquentes, réponses directes."},"Keep the learner record clear and portable.":{"es":"Mantén el expediente del estudiante claro y transferible.","fr":"Gardez le dossier de l'apprenant clair et transférable."},"Free learning, even without internet access.":{"es":"Aprendizaje gratuito, incluso sin conexión a internet.","fr":"Un apprentissage gratuit, même sans connexion internet."},"An elegant public gateway to education, research, creativity, health, civic knowledge, environmental stewardship, compassionate service, and intelligent navigation through the connected Verve N Veda ecosystem.":{"es":"Un elegante portal público hacia la educación, la investigación, la creatividad, la salud, el conocimiento cívico, la protección ambiental, el servicio solidario y la navegación inteligente por el ecosistema conectado de Verve N Veda.","fr":"Un portail public élégant vers l'éducation, la recherche, la créativité, la santé, les savoirs civiques, la protection de l'environnement, la solidarité et une navigation intelligente dans l'écosystème connecté de Verve N Veda."},"Choose a doorway or browse its complete resources.":{"es":"Elige una entrada o explora todos sus recursos.","fr":"Choisissez une entrée ou parcourez l'ensemble de ses ressources."},"The ecosystem is arranged into four balanced families so visitors can find the right doorway without being overwhelmed.":{"es":"El ecosistema se organiza en cuatro grupos equilibrados para que los visitantes encuentren el acceso adecuado sin sentirse abrumados.","fr":"L'écosystème est organisé en quatre ensembles équilibrés afin que les visiteurs trouvent facilement leur entrée, sans être submergés."},"Many public resources. One organized home.":{"es":"Muchos recursos públicos. Un hogar organizado.","fr":"De nombreuses ressources publiques, réunies en un lieu organisé."},"A network designed to connect rather than divide.":{"es":"Una red diseñada para unir, no para dividir.","fr":"Un réseau conçu pour rassembler plutôt que diviser."},"Enter through one doorway. Discover an entire world.":{"es":"Entra por una puerta. Descubre un mundo entero.","fr":"Franchissez une porte. Découvrez tout un monde."},"Verve N Veda is built as a public bridge between knowledge, creativity, service, community, and the lifelong practice of becoming.":{"es":"Verve N Veda es un puente público entre el conocimiento, la creatividad, el servicio, la comunidad y el aprendizaje y desarrollo personal a lo largo de la vida.","fr":"Verve N Veda est un pont ouvert à tous entre les connaissances, la créativité, le service, la communauté et l'évolution personnelle tout au long de la vie."}};
const EXPANDED_PHRASES={"All":{"es":"Todos","fr":"Tout","ar":"الكل","zh":"全部","de":"Alle","ru":"Все","pt":"Todos","hi":"सभी","ja":"すべて","ko":"전체","it":"Tutti","bn":"সব"},"Open":{"es":"Abrir","fr":"Ouvrir","ar":"افتح","zh":"打开","de":"Öffnen","ru":"Открыть","pt":"Abrir","hi":"खोलें","ja":"開く","ko":"열기","it":"Apri","bn":"খুলুন"},"Browse 30 local apps":{"es":"Explorar 30 aplicaciones locales","fr":"Explorer 30 applications locales","ar":"تصفح 30 تطبيقًا محليًا","zh":"浏览30个本地应用","de":"30 lokale Apps entdecken","ru":"Посмотреть 30 локальных приложений","pt":"Explorar 30 aplicativos locais","hi":"30 स्थानीय ऐप देखें","ja":"30個のアプリを見る","ko":"로컬 앱 30개 보기","it":"Esplora 30 app locali","bn":"৩০টি স্থানীয় অ্যাপ দেখুন"},"Five-Language Academy":{"es":"Academia de cinco idiomas","fr":"Académie des cinq langues","ar":"أكاديمية اللغات الخمس","zh":"五语学院","de":"Fünf-Sprachen-Akademie","ru":"Академия пяти языков","pt":"Academia de cinco idiomas","hi":"पाँच भाषा अकादमी","ja":"五言語アカデミー","ko":"5개 언어 아카데미","it":"Accademia delle cinque lingue","bn":"পাঁচ ভাষার একাডেমি"},"Sovereign Translator":{"es":"Traductor soberano","fr":"Traducteur souverain","ar":"المترجم المستقل","zh":"自主翻译工具","de":"Souveräner Übersetzer","ru":"Независимый переводчик","pt":"Tradutor soberano","hi":"स्वतंत्र अनुवादक","ja":"自主翻訳ツール","ko":"독립 번역기","it":"Traduttore sovrano","bn":"স্বাধীন অনুবাদক"},"Arabic Language":{"es":"Lengua árabe","fr":"Langue arabe","ar":"اللغة العربية","zh":"阿拉伯语","de":"Arabische Sprache","ru":"Арабский язык","pt":"Língua árabe","hi":"अरबी भाषा","ja":"アラビア語","ko":"아랍어","it":"Lingua araba","bn":"আরবি ভাষা"},"English / ESL":{"es":"Inglés / ESL","fr":"Anglais / ALS","ar":"الإنجليزية / تعليمها لغير الناطقين","zh":"英语／第二语言学习","de":"Englisch / ESL","ru":"Английский / ESL","pt":"Inglês / ESL","hi":"अंग्रेज़ी / ESL","ja":"英語／ESL","ko":"영어 / ESL","it":"Inglese / ESL","bn":"ইংরেজি / ESL"},"Qur'anic Arabic":{"es":"Árabe coránico","fr":"Arabe coranique","ar":"العربية القرآنية","zh":"古兰经阿拉伯语","de":"Koranarabisch","ru":"Коранический арабский","pt":"Árabe corânico","hi":"क़ुरआनी अरबी","ja":"クルアーン・アラビア語","ko":"꾸란 아랍어","it":"Arabo coranico","bn":"কোরআনিক আরবি"},"Language Compass":{"es":"Brújula de idiomas","fr":"Boussole des langues","ar":"بوصلة اللغات","zh":"语言指南针","de":"Sprachenkompass","ru":"Языковой компас","pt":"Bússola de idiomas","hi":"भाषा दिशा-सूचक","ja":"言語コンパス","ko":"언어 나침반","it":"Bussola linguistica","bn":"ভাষা দিকদর্শন"},"Start at the Front Desk":{"es":"Empezar en recepción","fr":"Commencer à l'accueil","ar":"ابدأ من الاستقبال","zh":"从服务台开始","de":"Am Empfang beginnen","ru":"Начать с приёмной","pt":"Começar na recepção","hi":"स्वागत कक्ष से शुरू करें","ja":"受付から始める","ko":"안내 데스크에서 시작","it":"Inizia dall'accoglienza","bn":"অভ্যর্থনা থেকে শুরু করুন"},"Welcome to the Academy":{"es":"Bienvenidos a la Academia","fr":"Bienvenue à l'Académie","ar":"أهلًا بك في الأكاديمية","zh":"欢迎来到学院","de":"Willkommen in der Akademie","ru":"Добро пожаловать в Академию","pt":"Boas-vindas à Academia","hi":"अकादमी में स्वागत है","ja":"アカデミーへようこそ","ko":"아카데미에 오신 것을 환영합니다","it":"Benvenuti all'Accademia","bn":"একাডেমিতে স্বাগতম"},"The Four Great Halls":{"es":"Las cuatro grandes salas","fr":"Les quatre grandes salles","ar":"القاعات الأربع الكبرى","zh":"四大展馆","de":"Die vier großen Hallen","ru":"Четыре великих зала","pt":"Os quatro grandes salões","hi":"चार विशाल सभागार","ja":"四大ホール","ko":"네 개의 큰 홀","it":"Le quattro grandi sale","bn":"চারটি প্রধান হল"},"Welcome Home":{"es":"Bienvenidos a casa","fr":"Bienvenue chez vous","ar":"أهلًا بك في بيتك","zh":"欢迎回家","de":"Willkommen zu Hause","ru":"Добро пожаловать домой","pt":"Boas-vindas ao lar","hi":"घर में स्वागत है","ja":"おかえりなさい","ko":"집에 오신 것을 환영합니다","it":"Benvenuti a casa","bn":"বাড়িতে স্বাগতম"},"Browse Every Public Hall":{"es":"Explorar todas las salas públicas","fr":"Explorer toutes les salles publiques","ar":"تصفح جميع القاعات العامة","zh":"浏览所有公共展馆","de":"Alle öffentlichen Hallen entdecken","ru":"Все открытые залы","pt":"Explorar todos os salões públicos","hi":"सभी सार्वजनिक सभागार देखें","ja":"すべての公開ホールを見る","ko":"모든 공개 홀 보기","it":"Esplora tutte le sale pubbliche","bn":"সব উন্মুক্ত হল দেখুন"}};
const TITLE_TRANSLATIONS={"Polyglot | Khaemenes Academy Linguistics & World Language Campus":{"es":"Polyglot | Khaemenes Academy: Lingüística e idiomas del mundo","fr":"Polyglot | Khaemenes Academy : linguistique et langues du monde","ar":"Polyglot | أكاديمية خيمينيس: اللغويات ولغات العالم","zh":"Polyglot | Khaemenes 学院：语言学与世界语言","de":"Polyglot | Khaemenes Academy: Linguistik und Weltsprachen","ru":"Polyglot | Академия Хеменес: лингвистика и языки мира","pt":"Polyglot | Academia Khaemenes: Linguística e línguas do mundo","hi":"Polyglot | खेमेनेस अकादमी: भाषाविज्ञान और विश्व भाषाएँ","ja":"Polyglot | Khaemenes Academy：言語学と世界の言語","ko":"Polyglot | Khaemenes Academy: 언어학과 세계 언어","it":"Polyglot | Accademia Khaemenes: linguistica e lingue del mondo","bn":"Polyglot | খেমেনেস একাডেমি: ভাষাবিজ্ঞান ও বিশ্বভাষা"},"Khaemenes Academy | Front Desk":{"es":"Khaemenes Academy | Recepción","fr":"Khaemenes Academy | Accueil","ar":"أكاديمية خيمينيس | الاستقبال","zh":"Khaemenes 学院 | 服务台","de":"Khaemenes Academy | Empfang","ru":"Академия Хеменес | Приёмная","pt":"Academia Khaemenes | Recepção","hi":"खेमेनेस अकादमी | स्वागत कक्ष","ja":"Khaemenes Academy | 受付","ko":"Khaemenes Academy | 안내 데스크","it":"Accademia Khaemenes | Accoglienza","bn":"খেমেনেস একাডেমি | অভ্যর্থনা"},"Verve N Veda | Public Gateway":{"es":"Verve N Veda | Portal público","fr":"Verve N Veda | Portail public","ar":"فيرف إن فيدا | البوابة العامة","zh":"Verve N Veda | 公共门户","de":"Verve N Veda | Öffentliches Portal","ru":"Verve N Veda | Общедоступный портал","pt":"Verve N Veda | Portal público","hi":"Verve N Veda | सार्वजनिक पोर्टल","ja":"Verve N Veda | 公開ポータル","ko":"Verve N Veda | 공개 포털","it":"Verve N Veda | Portale pubblico","bn":"Verve N Veda | উন্মুক্ত প্রবেশদ্বার"}};
const EXTENDED={"Language":["Idioma","भाषा","言語","언어","Lingua","ভাষা"],"Explore":["Explorar","देखें","探索","탐색","Esplora","অন্বেষণ"],"Halls":["Salões","सभागार","ホール","홀","Sale","হল"],"Matrix":["Matriz","मैट्रिक्स","マトリックス","매트릭스","Matrice","ম্যাট্রিক্স"],"Academy":["Academia","अकादमी","アカデミー","아카데미","Accademia","একাডেমি"],"Education":["Educação","शिक्षा","教育","교육","Istruzione","শিক্ষা"],"Language Apps":["Aplicativos de idiomas","भाषा ऐप","語学アプリ","언어 앱","App linguistiche","ভাষা অ্যাপ"],"Voice Studio":["Estúdio de voz","वॉइस स्टूडियो","音声スタジオ","음성 스튜디오","Studio vocale","ভয়েস স্টুডিও"],"World Atlas":["Atlas mundial","विश्व एटलस","世界地図帳","세계 지도책","Atlante mondiale","বিশ্ব অ্যাটলাস"],"Research":["Pesquisa","अनुसंधान","研究","연구","Ricerca","গবেষণা"],"News":["Notícias","समाचार","ニュース","뉴스","Notizie","সংবাদ"],"Weather":["Clima","मौसम","天気","날씨","Meteo","আবহাওয়া"],"Creative":["Criatividade","सृजनात्मक","創作","창작","Creatività","সৃজনশীল"],"Professional":["Profissional","पेशेवर","専門","전문","Professionale","পেশাদার"],"Games":["Jogos","खेल","ゲーム","게임","Giochi","গেম"],"Earth":["Terra","पृथ्वी","地球","지구","Terra","পৃথিবী"],"Health":["Saúde","स्वास्थ्य","健康","건강","Salute","স্বাস্থ্য"],"Connect":["Conectar","जुड़ें","つながる","연결","Connetti","সংযুক্ত করুন"],"Finance":["Finanças","वित्त","金融","재정","Finanza","অর্থব্যবস্থা"],"Civic":["Cidadania","नागरिक","市民","시민","Civico","নাগরিক"],"Promise":["Compromisso","वादा","約束","약속","Impegno","প্রতিশ্রুতি"],"Donate":["Doar","दान करें","寄付","기부","Dona","অনুদান দিন"],"Gateways":["Portais","प्रवेश द्वार","入口","포털","Portali","প্রবেশপথ"],"Pages":["Páginas","पृष्ठ","ページ","페이지","Pagine","পৃষ্ঠা"],"Apps":["Aplicativos","ऐप","アプリ","앱","App","অ্যাপ"],"Tools":["Ferramentas","उपकरण","ツール","도구","Strumenti","সরঞ্জাম"],"Courses":["Cursos","पाठ्यक्रम","コース","과정","Corsi","কোর্স"],"Resources":["Recursos","संसाधन","資料","자료","Risorse","রিসোর্স"],"Portals":["Portais","पोर्टल","ポータル","포털","Portali","পোর্টাল"],"Workshops":["Oficinas","कार्यशालाएँ","ワークショップ","워크숍","Laboratori","কর্মশালা"],"Studios":["Estúdios","स्टूडियो","スタジオ","스튜디오","Studi","স্টুডিও"],"Assessments":["Avaliações","मूल्यांकन","評価","평가","Valutazioni","মূল্যায়ন"],"Language Tools":["Ferramentas de idiomas","भाषा उपकरण","言語ツール","언어 도구","Strumenti linguistici","ভাষার সরঞ্জাম"],"Formal Academy":["Academia formal","औपचारिक अकादमी","正規アカデミー","정규 아카데미","Accademia formale","আনুষ্ঠানিক একাডেমি"],"Formal Study":["Estudo formal","औपचारिक अध्ययन","正規学習","정규 학습","Studi formali","আনুষ্ঠানিক শিক্ষা"],"Local Studios":["Estúdios locais","स्थानीय स्टूडियो","ローカルスタジオ","로컬 스튜디오","Studi locali","স্থানীয় স্টুডিও"],"Schools":["Escolas","विद्यालय","学校","학교","Scuole","স্কুল"],"Services":["Serviços","सेवाएँ","サービス","서비스","Servizi","সেবা"],"Accounts":["Contas","खाते","アカウント","계정","Account","অ্যাকাউন্ট"],"Help Desk":["Central de ajuda","सहायता केंद्र","ヘルプデスク","안내 데스크","Centro assistenza","সহায়তা কেন্দ্র"],"Beta Program":["Programa beta","बीटा कार्यक्रम","ベータプログラム","베타 프로그램","Programma beta","বিটা প্রোগ্রাম"],"Help":["Ajuda","सहायता","ヘルプ","도움말","Aiuto","সাহায্য"],"Beta":["Beta","बीटा","ベータ","베타","Beta","বিটা"],"Student":["Estudante","विद्यार्थी","学生","학생","Studente","শিক্ষার্থী"],"Family":["Família","परिवार","家族","가족","Famiglia","পরিবার"],"Teacher":["Professor","शिक्षक","教師","교사","Insegnante","শিক্ষক"],"Learning":["Aprendizagem","सीखना","学習","학습","Apprendimento","শেখা"],"Records":["Registros","अभिलेख","記録","기록","Documenti","নথি"],"Linguistics":["Linguística","भाषाविज्ञान","言語学","언어학","Linguistica","ভাষাবিজ্ঞান"],"Spanish":["Espanhol","स्पेनिश","スペイン語","스페인어","Spagnolo","স্প্যানিশ"],"French":["Francês","फ़्रेंच","フランス語","프랑스어","Francese","ফরাসি"],"German":["Alemão","जर्मन","ドイツ語","독일어","Tedesco","জার্মান"],"Russian":["Russo","रूसी","ロシア語","러시아어","Russo","রুশ"],"Arabic":["Árabe","अरबी","アラビア語","아랍어","Arabo","আরবি"],"Mandarin Chinese":["Chinês mandarim","मंदारिन चीनी","中国語（普通話）","중국어(표준어)","Cinese mandarino","ম্যান্ডারিন চীনা"],"Japanese":["Japonês","जापानी","日本語","일본어","Giapponese","জাপানি"],"Listening":["Escuta","सुनना","聞くこと","듣기","Ascolto","শোনা"],"Speaking":["Fala","बोलना","話すこと","말하기","Conversazione","বলা"],"Reading":["Leitura","पढ़ना","読むこと","읽기","Lettura","পড়া"],"Writing":["Escrita","लिखना","書くこと","쓰기","Scrittura","লেখা"],"Translation":["Tradução","अनुवाद","翻訳","번역","Traduzione","অনুবাদ"],"Culture":["Cultura","संस्कृति","文化","문화","Cultura","সংস্কৃতি"],"Mediation":["Mediação","मध्यस्थता","仲介","중재","Mediazione","মধ্যস্থতা"],"Voice":["Voz","आवाज़","音声","음성","Voce","কণ্ঠ"],"Search":["Pesquisar","खोजें","検索","검색","Cerca","অনুসন্ধান"],"Clear":["Limpar","साफ़ करें","クリア","지우기","Cancella","মুছুন"],"Begin with a greeting.":["Comece com uma saudação.","एक अभिवादन से शुरू करें।","あいさつから始めましょう。","인사말로 시작하세요.","Inizia con un saluto.","একটি অভিবাদন দিয়ে শুরু করুন।"],"Hear phrase":["Ouvir frase","वाक्य सुनें","フレーズを聞く","문구 듣기","Ascolta la frase","বাক্যটি শুনুন"],"Next phrase":["Próxima frase","अगला वाक्य","次のフレーズ","다음 문구","Frase successiva","পরবর্তী বাক্য"],"Choose a voice":["Escolher uma voz","आवाज़ चुनें","音声を選択","음성 선택","Scegli una voce","কণ্ঠ বেছে নিন"],"Open the Academy":["Abrir a Academia","अकादमी खोलें","アカデミーを開く","아카데미 열기","Apri l'Accademia","একাডেমি খুলুন"],"Open Academy":["Abrir Academia","अकादमी खोलें","アカデミーを開く","아카데미 열기","Apri Accademia","একাডেমি খুলুন"],"Support Polyglot":["Apoiar o Polyglot","पॉलीग्लॉट का समर्थन करें","Polyglotを支援","Polyglot 후원","Sostieni Polyglot","Polyglot-কে সহায়তা করুন"],"Switch color theme":["Alterar tema de cores","रंग थीम बदलें","テーマを切り替える","테마 변경","Cambia tema","রঙের থিম বদলান"],"Open navigation":["Abrir navegação","नेविगेशन खोलें","ナビゲーションを開く","탐색 메뉴 열기","Apri navigazione","নেভিগেশন খুলুন"],"Language filter":["Filtro de idioma","भाषा फ़िल्टर","言語フィルター","언어 필터","Filtro lingua","ভাষা ফিল্টার"],"Practice text":["Texto de prática","अभ्यास पाठ","練習テキスト","연습 텍스트","Testo di esercizio","অনুশীলনের পাঠ্য"],"Speech rate":["Velocidade da fala","बोलने की गति","読み上げ速度","말하기 속도","Velocità voce","বলার গতি"],"Voice pitch":["Tom da voz","आवाज़ की पिच","声の高さ","음성 높이","Tono della voce","কণ্ঠের স্বর"],"Hear practice text":["Ouvir texto de prática","अभ्यास पाठ सुनें","練習テキストを聞く","연습 텍스트 듣기","Ascolta testo","অনুশীলনের পাঠ্য শুনুন"],"Stop speech":["Parar fala","बोलना रोकें","読み上げを停止","음성 중지","Ferma lettura","কণ্ঠ বন্ধ করুন"],"Use browser default":["Usar padrão do navegador","ब्राउज़र डिफ़ॉल्ट उपयोग करें","ブラウザーの既定を使用","브라우저 기본값 사용","Usa predefinito","ব্রাউজারের ডিফল্ট ব্যবহার করুন"],"Return to Top":["Voltar ao topo","ऊपर जाएँ","ページの先頭へ","맨 위로","Torna su","উপরে ফিরুন"],"Primary navigation":["Navegação principal","मुख्य नेविगेशन","メインナビゲーション","기본 탐색","Navigazione principale","প্রধান নেভিগেশন"],"Quick access":["Acesso rápido","त्वरित पहुँच","クイックアクセス","빠른 접근","Accesso rapido","দ্রুত প্রবেশ"],"World Language Atlas":["Atlas das línguas do mundo","विश्व भाषा एटलस","世界言語アトラス","세계 언어 지도","Atlante delle lingue del mondo","বিশ্ব ভাষা অ্যাটলাস"]};
const MAP=new Map(ROWS.map(row=>[row[0],row]));
const META={"en":["English","Language"],"es":["Español","Idioma"],"fr":["Français","Langue"],"ar":["العربية","اللغة"],"zh":["中文","语言"],"de":["Deutsch","Sprache"],"ru":["Русский","Язык"],"pt":["Português","Idioma"],"hi":["हिन्दी","भाषा"],"ja":["日本語","言語"],"ko":["한국어","언어"],"it":["Italiano","Lingua"],"bn":["বাংলা","ভাষা"]};
const CONTROL_LABELS={"en":["Translate remaining text","Translation audit","Working…","English source","translated","phrases to review"],"es":["Traducir texto pendiente","Informe de traducción","Traduciendo…","Texto original en inglés","traducido","frases por revisar"],"fr":["Traduire le texte restant","Rapport de traduction","Traduction…","Texte original anglais","traduit","expressions à revoir"],"ar":["ترجمة النص المتبقي","تقرير الترجمة","جارٍ الترجمة…","النص الأصلي بالإنجليزية","مترجم","عبارات للمراجعة"],"zh":["翻译剩余文本","翻译检查报告","翻译中…","英文原文","已翻译","条待审核"],"de":["Restlichen Text übersetzen","Übersetzungsbericht","Übersetzung läuft…","Englischer Originaltext","übersetzt","Einträge zur Prüfung"],"ru":["Перевести оставшийся текст","Отчёт о переводе","Перевод…","Английский оригинал","переведено","фраз на проверку"],"pt":["Traduzir texto restante","Relatório de tradução","Traduzindo…","Texto original em inglês","traduzido","frases para revisar"],"hi":["शेष पाठ का अनुवाद","अनुवाद रिपोर्ट","अनुवाद जारी…","मूल अंग्रेज़ी पाठ","अनूदित","वाक्यांश समीक्षा के लिए"],"ja":["残りの文章を翻訳","翻訳レポート","翻訳中…","英語の原文","翻訳済み","要確認の文"],"ko":["남은 텍스트 번역","번역 검토 보고서","번역 중…","영어 원문","번역됨","검토할 문구"],"it":["Traduci testo rimanente","Rapporto traduzioni","Traduzione in corso…","Testo inglese originale","tradotto","frasi da rivedere"],"bn":["বাকি পাঠ্য অনুবাদ করুন","অনুবাদ প্রতিবেদন","অনুবাদ চলছে…","মূল ইংরেজি পাঠ্য","অনূদিত","পর্যালোচনার বাক্য"]};
const KEY="vnv_language_v1",PARAM="lang";
const original=new WeakMap(),lastRendered=new WeakMap(),attributeBase=new WeakMap(),lastAttrs=new WeakMap();
const titleState={source:document.title,rendered:null};
let coverageScheduled=false;
/* Translation coverage engine: static and dynamically inserted public UI only. */
const LANG_CACHE_KEY="vnv_translated_phrases_v2";
const SESSION_TRANSLATION_KEY="vnv_public_translation_consent_v1";
let translationsCache={};
try{translationsCache=JSON.parse(localStorage.getItem(LANG_CACHE_KEY)||"{}")||{}}catch{}
let translationBusy=false,translationStop=false;
function getConsent(){try{return sessionStorage.getItem(SESSION_TRANSLATION_KEY)}catch{return null}}
function setConsent(v){try{sessionStorage.setItem(SESSION_TRANSLATION_KEY,v)}catch{}}
function requestOnlineConsent(){
 const answer=window.confirm("Complete this public page's untranslated text with MyMemory? Only public page text is sent to the translation service. Learner answers, account data and private workspaces are excluded. Cancel keeps this page offline.");
 setConsent(answer?"yes":"no");return answer;
}
function cacheKey(src,code){return code+"|"+src}
function cachedTranslation(src,code){return translationsCache[cacheKey(src,code)]||null}
function cacheTranslation(src,code,value){
 if(!value||!value.trim())return;
 translationsCache[cacheKey(src,code)]=value;
 const all=Object.entries(translationsCache);if(all.length>1600)translationsCache=Object.fromEntries(all.slice(-1200));
 try{localStorage.setItem(LANG_CACHE_KEY,JSON.stringify(translationsCache))}catch{}
}
function shouldTranslateText(src){return /[\p{L}]/u.test(src) && src.length>=2}
function translationEvidence(source){
 if(lang==="en")return "source-language";
 const hit=window.KhaemenesSovereignTranslate?.lookupLocal?.({from:"en",to:lang,text:source});
 if(hit?.verified===true&&hit.translation)return "locally-reviewed";
 const idx=CODES.indexOf(lang),row=MAP.get(source);
 if(EXPANDED_PHRASES[source]?.[lang]||(row&&idx<7&&row[idx])||(idx>=7&&EXTENDED[source]?.[idx-7])||TITLE_TRANSLATIONS[source]?.[lang]||REVIEWED_PUBLIC_COPY[source]?.[lang])return "curated-public-copy";
 if(/^Open (.+)$/.test(source)&&EXPANDED_PHRASES.Open?.[lang]&&translate(source))return "composed-interface";
 if(hit?.translation)return "unreviewed-source-draft";
 if(cachedTranslation(source,lang))return "machine-or-browser-cache";
 return "untranslated";
}
function coverage(){
 const missing=new Set();let total=0,covered=0;
 const evidence={"source-language":0,"locally-reviewed":0,"curated-public-copy":0,"composed-interface":0,"unreviewed-source-draft":0,"machine-or-browser-cache":0,"untranslated":0};
 function count(source){const type=translationEvidence(source);total++;evidence[type]++;if(type==="untranslated")missing.add(source);else covered++;}

 const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while((n=walk.nextNode())){if(!n.parentElement||ignored(n.parentElement))continue;
  const source=normalize(original.get(n)===undefined?n.nodeValue:original.get(n));
  if(!shouldTranslateText(source))continue;
  count(source);
 }
 for(const el of document.querySelectorAll("[placeholder],[aria-label],[title],[alt]")){
  if(ignored(el))continue;
  const attrs=attributeBase.get(el)||{};
  for(const key of ["placeholder","aria-label","title","alt"]){
   const source=normalize(attrs[key]??el.getAttribute(key)??"");
   if(!shouldTranslateText(source))continue;
   count(source);
  }
 }
 if(shouldTranslateText(titleState.source)){
  total++;if(lang==="en"||translate(titleState.source))covered++;else missing.add(titleState.source);
 }
 return {language:lang,total,translated:covered,missing:missing.size,evidence,coverageMeaning:"Source-string lookup categories; not independent human accuracy verification.",samples:[...missing].slice(0,20),untranslated:[...missing]};
}
function updateCoverage(){
 const c=coverage(),labels=CONTROL_LABELS[lang]||CONTROL_LABELS.en;
 for(const el of document.querySelectorAll("[data-vnv-coverage]")){
  // Show provenance rather than suggesting every available phrase is independently verified.
  const e=c.evidence;
  const drafts=e["unreviewed-source-draft"]+e["machine-or-browser-cache"];
  el.textContent=lang==="en"?labels[3]:
   `${Math.round(100*c.translated/Math.max(c.total,1))}% available · ${e["locally-reviewed"]} reviewed · ${e["curated-public-copy"]} curated · ${drafts} drafts · ${e.untranslated} untranslated`;
  el.title="Source-string matches, not a human accuracy score. Composed interface: "+e["composed-interface"]+
   "; unreviewed source: "+e["unreviewed-source-draft"]+"; machine/browser cache: "+e["machine-or-browser-cache"]+
   "; original language: "+e["source-language"]+". Export Translation audit for full details.";
  el.lang="en";el.dir="ltr";
 }
}
function scheduleCoverage(){
 if(coverageScheduled)return;
 coverageScheduled=true;
 requestAnimationFrame(()=>{coverageScheduled=false;updateCoverage()});
}
function exportTranslationAudit(){
 const report={version:1,page:location.pathname,language:lang,generatedAt:new Date().toISOString(),...coverage()};
 const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.download="translation-coverage-"+lang+".json";a.href=url;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function addCoverageControl(wrap){
 const progress=document.createElement("span");progress.dataset.vnvCoverage="1";progress.setAttribute("role","status");progress.setAttribute("data-i18n-ignore","");progress.style.cssText="font-size:11px;line-height:1.4;color:#544f42;white-space:normal;max-width:165px";
 const btn=document.createElement("button");btn.type="button";btn.textContent=(CONTROL_LABELS[lang]||CONTROL_LABELS.en)[0];btn.className="vnv-translate-complete";
 btn.title="Complete missing public-page translations on this device when possible; online service only after consent";btn.setAttribute("data-i18n-ignore","");
 btn.addEventListener("click",completeMissingTranslations);
 const audit=document.createElement("button");audit.type="button";
 audit.textContent=(CONTROL_LABELS[lang]||CONTROL_LABELS.en)[1];audit.className="vnv-translation-audit";
 audit.setAttribute("data-i18n-ignore","");
 audit.title="Export missing visible public page phrases as JSON";
 audit.addEventListener("click",exportTranslationAudit);
 wrap.append(progress,btn,audit);
}
async function localTranslator(target){
 const api=window.Translator;
 if(!api||typeof api.create!=="function")return null;
 let result;try{result=typeof api.availability==="function"?await api.availability({sourceLanguage:"en",targetLanguage:target}):"available"}catch{return null}
 if(result==="unavailable")return null;
 try{return await api.create({sourceLanguage:"en",targetLanguage:target})}catch{return null}
}
async function onlineTranslate(src,target){
 if(src.length>410){
  const words=src.split(/\s+/u),pieces=[],parts=[];let part="";
  for(const word of words){
   if((part+" "+word).length>380&&part){pieces.push(part);part=word}else part+=(part?" ":"")+word;
  }
  if(part)pieces.push(part);
  for(const piece of pieces)parts.push(await onlineTranslate(piece,target));
  return parts.join(" ");
 }
 const query=new URL("https://api.mymemory.translated.net/get");
 query.searchParams.set("q",src);query.searchParams.set("langpair","en|"+target);
 const response=await fetch(query.href,{method:"GET",credentials:"omit",referrerPolicy:"no-referrer",cache:"no-store"});
 if(!response.ok)throw Error("Translation service unavailable");
 const payload=await response.json();
 const txt=String(payload?.responseData?.translatedText||"").trim();
 if(!txt||Number(payload.responseStatus||200)>=400)throw Error("Translation service rejected request");
 const holder=document.createElement("textarea");holder.innerHTML=txt;return holder.value;
}
function updateProgress(msg){for(const el of document.querySelectorAll("[data-vnv-coverage]"))el.textContent=msg}
async function completeMissingTranslations(){
 if(lang==="en"||translationBusy)return;
 const target=lang;translationBusy=true;translationStop=false;
 document.querySelectorAll(".vnv-translate-complete").forEach(b=>{b.disabled=true;b.textContent=(CONTROL_LABELS[lang]||CONTROL_LABELS.en)[2]});
 try{
  const originals=new Set();const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){
   if(!node.parentElement||ignored(node.parentElement)||node.parentElement.closest("#adminGate,form,[data-private],[data-learner],[data-student],[data-account],[data-i18n-no-online]"))continue;
   const text=normalize(original.get(node)??node.nodeValue);
   if(shouldTranslateText(text)&&!translate(text))originals.add(text);
  }
  for(const el of document.querySelectorAll("[placeholder],[aria-label],[title],[alt]")){
   if(ignored(el)||el.closest("#adminGate,form,[data-private],[data-learner],[data-student],[data-account],[data-i18n-no-online]"))continue;
   const attrs=attributeBase.get(el)||{};
   for(const key of ["placeholder","aria-label","title","alt"]){
    const text=normalize(attrs[key]??el.getAttribute(key)??"");
    if(shouldTranslateText(text)&&!translate(text))originals.add(text);
   }
  }
  if(shouldTranslateText(titleState.source)&&!translate(titleState.source))originals.add(titleState.source);
  const remaining=[...originals];if(!remaining.length){updateCoverage();return}
  let machine=await localTranslator(target),useOnline=false;
  if(!machine){
   const approved=getConsent()==="yes"||requestOnlineConsent();
   if(!approved){updateProgress("Offline translations only · online translation declined");return}
   useOnline=true;
  }
  let done=0,failed=0;
  for(const text of remaining){
   if(target!==lang||translationStop)break;
   try{
    const value=useOnline?await onlineTranslate(text,target):await machine.translate(text);
    if(value&&value.trim()&&normalize(value)!==text)cacheTranslation(text,target,value.trim());
    else failed++;
   }catch{failed++}
   done++;if(done%3===0||done===remaining.length){translateTree(document.body);updateProgress(`${done}/${remaining.length} checked · ${failed} unavailable`)}
   if(useOnline)await new Promise(r=>setTimeout(r,260));
  }
  translateTree(document.body);translatePageTitle();updateCoverage();
  if(failed)updateProgress(`${coverage().translated}/${coverage().total} translated · ${failed} automated translations unavailable`);
  if(machine&&typeof machine.destroy==="function")machine.destroy();
 }finally{translationBusy=false;document.querySelectorAll(".vnv-translate-complete").forEach(b=>{b.disabled=false;b.textContent=(CONTROL_LABELS[lang]||CONTROL_LABELS.en)[0]})}
}
const normalize=s=>String(s).replace(/\s+/g," ").trim();
function readPref(){try{return localStorage.getItem(KEY)}catch{return null}}
function storePref(v){try{localStorage.setItem(KEY,v)}catch{}}
const params=new URLSearchParams(location.search);
const urlLang=params.get(PARAM);
let lang=CODES.includes(urlLang)?urlLang:(CODES.includes(readPref())?readPref():"en");
if(urlLang&&CODES.includes(urlLang))storePref(lang);
function translate(s){
 const source=normalize(s),idx=CODES.indexOf(lang);
 if(idx===0)return source;
 // Reuse the canonical sovereign Interlingual library. A genuinely reviewed
 // browser-local pair outranks public draft interface translations.
 const sovereign=window.KhaemenesSovereignTranslate?.lookupLocal?.({from:"en",to:lang,text:source});
 if(sovereign?.verified===true&&sovereign.translation)return sovereign.translation;
 if(EXPANDED_PHRASES[source]?.[lang])return EXPANDED_PHRASES[source][lang];
 const row=MAP.get(source);
 if(row&&idx<7&&row[idx])return row[idx];
 if(idx>=7&&EXTENDED[source]?.[idx-7])return EXTENDED[source][idx-7];
 if(TITLE_TRANSLATIONS[source]?.[lang])return TITLE_TRANSLATIONS[source][lang];
 if(EXPANDED_PHRASES[source]?.[lang])return EXPANDED_PHRASES[source][lang];
 if(REVIEWED_PUBLIC_COPY[source]?.[lang])return REVIEWED_PUBLIC_COPY[source][lang];
 if(lang!=="en"){
  const match=source.match(/^Open (.+)$/);
  if(match&&EXPANDED_PHRASES.Open?.[lang])return EXPANDED_PHRASES.Open[lang]+" "+(translate(match[1])||match[1]);
 }
 return (sovereign?.translation||cachedTranslation(source,lang));
}
function ignored(el){
 return !!(el&&el.closest("script,style,noscript,svg,math,code,pre,textarea,select,option,[contenteditable],#adminGate,[data-i18n-ignore],.world-ribbon,.phrase-main,.phrase-translation,.phrase-language"));
}
function textTranslate(n){
 const parent=n.parentElement;
 if(!parent||ignored(parent))return;
 let base=original.get(n);
 if(base===undefined||n.nodeValue!==lastRendered.get(n)){base=n.nodeValue;original.set(n,base)}
 const phrase=normalize(base);if(!phrase)return;
 const replacement=translate(phrase);
 const value=replacement?base.replace(phrase,replacement):base;
 if(n.nodeValue!==value)n.nodeValue=value;
 lastRendered.set(n,value);
}
function attrsTranslate(el){
 if(ignored(el))return;
 let base=attributeBase.get(el),recent=lastAttrs.get(el);
 if(!base){base={};recent={};attributeBase.set(el,base);lastAttrs.set(el,recent)}
 for(const key of ["placeholder","aria-label","title","alt"]){
  const current=el.getAttribute(key);if(current===null)continue;
  if(!(key in base)||current!==recent[key])base[key]=current;
  const replacement=translate(base[key]),next=replacement||base[key];
  if(current!==next)el.setAttribute(key,next);
  recent[key]=next;
 }
}
function translatePageTitle(){
 const current=document.title;
 if(current!==titleState.rendered&&current!==titleState.source)titleState.source=current;
 const replacement=translate(titleState.source),next=replacement||titleState.source;
 if(current!==next)document.title=next;
 titleState.rendered=next;
}
function translateTree(root){
 if(root.nodeType===Node.TEXT_NODE){textTranslate(root);return}
 if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_NODE)return;
 if(root.nodeType===Node.ELEMENT_NODE){if(ignored(root))return;attrsTranslate(root)}
 const tree=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
 let node;
 while((node=tree.nextNode())){
  if(node.nodeType===Node.TEXT_NODE)textTranslate(node);
  else if(!ignored(node))attrsTranslate(node);
 }
}
const styles=document.createElement("style");
styles.textContent=`
#vnv-language-actions{display:flex;justify-self:end;align-items:center;justify-content:flex-end;gap:8px;min-width:0}
.vnv-language-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;justify-self:end;min-width:0}
.vnv-language-actions .menu-button{flex:0 0 40px}
#vnv-language-switch-drawer{display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;margin:10px auto 16px;max-width:100%;padding:8px;border:1px solid rgba(87,74,48,.3);border-radius:7px;background:#fffdf8;color:#162b24;font:400 12px/1.4 Arial,sans-serif}
#vnv-language-switch-drawer select{max-width:175px;min-width:112px;padding:7px 9px;border:1px solid #a89a79;border-radius:7px;background:#fff;color:#17211d;font:inherit}
#vnv-language-switch-drawer label{white-space:nowrap}
body > #vnv-language-switch{display:flex;width:max-content;max-width:calc(100% - 24px);margin:10px auto;min-height:45px}
#vnv-language-switch{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap;padding:7px 10px;margin:7px;border:1px solid rgba(87,74,48,.3);border-radius:7px;background:#fffdf8;color:#162b24;font:400 12px/1.4 "Brandon Grotesque","Avenir Next",Arial,sans-serif;text-align:center;max-width:100%;position:relative;z-index:1550}
#vnv-language-switch label{font-weight:400;white-space:nowrap}
#vnv-language-select{appearance:auto;max-width:175px;min-width:112px;padding:7px 9px;border:1px solid #a89a79;border-radius:7px;background:#fff;color:#17211d;font:inherit}
#vnv-language-select:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
html[dir="rtl"] #vnv-language-switch,html[dir="rtl"] #vnv-language-switch-drawer{direction:rtl}
.vnv-translate-complete,.vnv-translation-audit{padding:6px 9px;border:1px solid #a89a79;border-radius:7px;background:#f5f0e4;color:#14261c;cursor:pointer;font:inherit;font-size:11px}.vnv-translate-complete:disabled{opacity:.6;cursor:wait}
/* Compact parchment language rail, preserving all translation functions. */
#vnv-language-switch{
  gap:6px;padding:6px 10px;margin:7px auto;
  border-color:rgba(87,74,48,.18);background:rgba(255,253,248,.88);
  box-shadow:0 2px 12px rgba(40,45,35,.045);
  font-size:11px;line-height:1.35;
}
body > #vnv-language-switch{
  min-height:40px;width:fit-content;max-width:calc(100% - 20px);
  margin:8px auto 10px;
}
#vnv-language-select{
  min-height:40px;min-width:104px;max-width:155px;
  padding:5px 8px;border-color:rgba(87,74,48,.26);background:#fffdf9;
}
#vnv-language-switch .vnv-translate-complete,
#vnv-language-switch .vnv-translation-audit{
  min-height:40px;padding:6px 9px;
  border-color:rgba(87,74,48,.2);background:#f5f0e6;font-size:10px;
}
@media(max-width:480px){
  #vnv-language-switch{gap:5px;padding:6px;justify-content:center}
  #vnv-language-switch label{font-size:10px}
}
/* Canonical charcoal translation rail. Preserve selectors and translation controls. */
#vnv-language-switch,
#vnv-language-switch-drawer{
  background:#243038;
  color:#fff8e9;
  border:1px solid #b48b45;
  box-shadow:0 2px 12px rgba(20,28,24,.14);
}
#vnv-language-switch label,
#vnv-language-switch-drawer label{
  color:#fff8e9;
  -webkit-text-fill-color:#fff8e9;
}
#vnv-language-switch #vnv-language-select,
#vnv-language-switch-drawer #vnv-language-select-drawer{
  background:#fff8e9;
  color:#243038;
  -webkit-text-fill-color:#243038;
  border-color:#b48b45;
}
#vnv-language-switch .vnv-translate-complete,
#vnv-language-switch .vnv-translation-audit,
#vnv-language-switch-drawer .vnv-translate-complete,
#vnv-language-switch-drawer .vnv-translation-audit{
  background:#fff8e9;
  color:#243038;
  -webkit-text-fill-color:#243038;
  border-color:#b48b45;
}
#vnv-language-switch :is(select,button):focus-visible,
#vnv-language-switch-drawer :is(select,button):focus-visible{
  outline:3px solid #e3c389;
  outline-offset:2px;
}
/* Full-width charcoal language band beneath the VNV gateway header. */
#vnv-language-rail{
  box-sizing:border-box;
  width:100%;
  padding:7px 16px 8px;
  background:#243038;
  border-bottom:1px solid #b48b45;
}
#vnv-language-rail #vnv-language-switch{
  display:flex;
  width:fit-content;
  max-width:100%;
  min-height:36px;
  gap:8px;
  margin:0 auto;
  padding:0;
  border:0;
  border-radius:7px;
  box-shadow:none;
  background:transparent;
  color:#fff8e9;
  font-size:16px;
}
#vnv-language-rail #vnv-language-switch label{
  font-size:16px;
  color:#fff8e9;
  -webkit-text-fill-color:#fff8e9;
}
#vnv-language-rail #vnv-language-select,
#vnv-language-rail .vnv-translate-complete,
#vnv-language-rail .vnv-translation-audit{
  box-sizing:border-box;
  min-height:36px;
  height:auto;
  padding:6px 11px;
  border:1px solid #b48b45;
  border-radius:7px;
  font-size:16px;
  line-height:1.3;
  font-weight:400;
  background:#fff8e9;
  color:#243038;
  -webkit-text-fill-color:#243038;
}
#vnv-language-rail #vnv-language-switch [data-vnv-coverage]{
  font-size:13px!important;
  color:#fff8e9!important;
  -webkit-text-fill-color:#fff8e9!important;
}
@media(max-width:650px){
  #vnv-language-rail{padding:8px 12px;}
  #vnv-language-rail #vnv-language-switch{width:100%;justify-content:center;gap:7px;flex-wrap:wrap;}
  #vnv-language-rail #vnv-language-select,
  #vnv-language-rail .vnv-translate-complete,
  #vnv-language-rail .vnv-translation-audit{min-height:38px;}
}
/* Crisp cream translator controls, scoped to the full-width gateway band. */
#vnv-language-rail #vnv-language-switch .vnv-translate-complete,
#vnv-language-rail #vnv-language-switch .vnv-translation-audit,
#vnv-language-rail #vnv-language-switch #vnv-language-select{
  background-color:#fffaf0;
  background-image:none;
  color:#243038;
  -webkit-text-fill-color:#243038;
  border:1px solid #cab58c;
  border-radius:7px;
  min-height:38px;
  padding:7px 13px;
  font:400 16px/1.35 "Brandon Grotesque",Nunito,Arial,sans-serif;
  letter-spacing:.005em;
  box-shadow:0 1px 2px rgba(0,0,0,.12);
  transition:background-color .15s ease,border-color .15s ease;
}
#vnv-language-rail #vnv-language-switch :is(.vnv-translate-complete,.vnv-translation-audit):hover{
  background-color:#f3e6d0;
  border-color:#b48b45;
}
#vnv-language-rail #vnv-language-switch :is(.vnv-translate-complete,.vnv-translation-audit):disabled{
  opacity:.7;
  cursor:wait;
}
#vnv-language-switch-drawer :is(.vnv-translate-complete,.vnv-translation-audit),
#vnv-language-switch-drawer #vnv-language-select-drawer{
  background-color:#fffaf0;
  color:#243038;
  -webkit-text-fill-color:#243038;
  border:1px solid #cab58c;
  border-radius:7px;
  font:400 16px/1.35 "Brandon Grotesque",Nunito,Arial,sans-serif;
}
@media(prefers-reduced-motion:reduce){
  #vnv-language-rail #vnv-language-switch :is(.vnv-translate-complete,.vnv-translation-audit){transition:none}
}
html[dir="rtl"] .ecosystem-category-grid,html[dir="rtl"] .quick-grid,html[dir="rtl"] .school-grid{direction:ltr}
html[dir="rtl"] .ecosystem-category-grid > *,html[dir="rtl"] .quick-grid > *,html[dir="rtl"] .school-grid > *{direction:rtl}
@media(max-width:480px){#vnv-language-switch{margin:6px auto}#vnv-language-select{min-width:106px}}
`;
document.head.append(styles);
function makeSelector(){
 if(document.getElementById("vnv-language-switch"))return;
 const wrap=document.createElement("div");wrap.id="vnv-language-switch";wrap.setAttribute("data-i18n-ignore","");
 const label=document.createElement("label");label.htmlFor="vnv-language-select";
 const select=document.createElement("select");select.id="vnv-language-select";
 select.setAttribute("aria-label","Choose interface language");
 for(const c of CODES){const opt=document.createElement("option");opt.value=c;opt.textContent=META[c][0];select.append(opt)}
 select.value=lang;wrap.append(label,select);addCoverageControl(wrap);
 let target;
 if(document.querySelector(".site-header .header-inner")){
  const main=document.querySelector("main");
  if(main){
   let rail=document.getElementById("vnv-language-rail");
   if(!rail){rail=document.createElement("div");rail.id="vnv-language-rail";rail.setAttribute("role","group");rail.setAttribute("aria-label","Page translation tools");main.before(rail)}
   rail.append(wrap);
  }else document.body.append(wrap);
  const drawer=document.getElementById("menuDrawer");
  if(drawer){
   const mirror=wrap.cloneNode(true);
   mirror.id="vnv-language-switch-drawer";
   mirror.querySelector("label").htmlFor="vnv-language-select-drawer";
   const mirrorSelect=mirror.querySelector("select");
   mirrorSelect.id="vnv-language-select-drawer";
   const heading=drawer.querySelector(".drawer-top");
   if(heading)heading.after(mirror);else drawer.prepend(mirror);
   mirrorSelect.addEventListener("change",()=>setLanguage(mirrorSelect.value,true));
   const mirrorButton=mirror.querySelector(".vnv-translate-complete");
   if(mirrorButton)mirrorButton.addEventListener("click",completeMissingTranslations);
   const auditButton=mirror.querySelector(".vnv-translation-audit");
   if(auditButton)auditButton.addEventListener("click",exportTranslationAudit);
  }
 }else if(document.querySelector(".header-main-inner")){
  const main=document.querySelector("main");if(main)main.before(wrap);else document.body.append(wrap);
 }else if(document.querySelector(".ribbon")){
  const main=document.querySelector("main");
  if(main)main.before(wrap);else{target=document.querySelector(".ribbon");target.after(wrap)}
 }else{
  const main=document.querySelector("main");
  if(main)main.before(wrap);else document.body.prepend(wrap);
 }
 select.addEventListener("change",()=>setLanguage(select.value,true));
 updateLabel();
}
function updateLabel(){
 document.querySelectorAll('#vnv-language-switch label,#vnv-language-switch-drawer label').forEach(lab=>lab.textContent=META[lang][1]+":");
 for(const name of ["vnv-language-select","vnv-language-select-drawer"]){const sel=document.getElementById(name);if(sel)sel.value=lang;}
 const control=CONTROL_LABELS[lang]||CONTROL_LABELS.en;
 document.querySelectorAll(".vnv-translate-complete").forEach(b=>{if(!translationBusy)b.textContent=control[0]});
 document.querySelectorAll(".vnv-translation-audit").forEach(b=>b.textContent=control[1]);
}
async function completeWithInstalledModel(selected,interactive=false){
 if(selected==="en"||!coverage().missing)return;
 let available=false;
 try{
  if(window.Translator?.availability){
   const state=await window.Translator.availability({sourceLanguage:"en",targetLanguage:selected});
   available=state==="available";
  }
 }catch{}
 if(lang!==selected)return;
 if(available){completeMissingTranslations();return}
 if(getConsent()==="yes"){completeMissingTranslations();return}
 if(interactive&&getConsent()!=="no"&&requestOnlineConsent()){completeMissingTranslations()}
}
function setLanguage(next,interactive=false){
 if(!CODES.includes(next))return;
 lang=next;storePref(lang);
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==="ar"?"rtl":"ltr";
 translationStop=true;
 updateLabel();translateTree(document.body);translatePageTitle();updateCoverage();
 completeWithInstalledModel(lang,interactive);
 document.dispatchEvent(new CustomEvent("vnv:language-change",{detail:{language:lang}}));
}
function internalRoute(url){
 // Only first-party ecosystem hosts receive the interface preference.
 // Never append it to unrelated links, downloads, mail, or third-party sites.
 if(url.protocol!=="https:")return false;
 const host=url.hostname.toLowerCase();
 return host==="vervenveda.com"||host==="www.vervenveda.com"||
  host==="vervenveda.github.io"||host==="khaemenesacademy.github.io"||
  host==="artist1970.github.io";
}
document.addEventListener("click",event=>{
 const link=event.target.closest&&event.target.closest("a[href]");
 if(!link||lang==="en"||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const href=link.getAttribute("href");if(!href||href.startsWith("#"))return;
 let url;try{url=new URL(href,location.href)}catch{return}
 if(!internalRoute(url))return;
 url.searchParams.set(PARAM,lang);
 link.href=url.href;
},true);
function init(){
 makeSelector();
 setLanguage(lang);
 const observer=new MutationObserver(records=>{
  let changed=false;
  for(const record of records){
   if(record.type==="childList"){
    for(const node of record.addedNodes){translateTree(node);changed=true}
   }else if(record.type==="characterData"){
    translateTree(record.target);changed=true;
   }else if(record.type==="attributes"){
    attrsTranslate(record.target);changed=true;
   }
  }
  if(changed)scheduleCoverage();
 });
 observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["placeholder","aria-label","title","alt"]});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
window.VNVLanguage=Object.freeze({getLanguage:()=>lang,setLanguage,availableLanguages:()=>CODES.slice(),coverage,refresh:()=>{translateTree(document.body);translatePageTitle();updateCoverage()},translateRemaining:completeMissingTranslations,exportAudit:exportTranslationAudit});
})();