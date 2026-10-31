document.addEventListener('DOMContentLoaded', () => {
  loadBudgetData();
  loadThemePreference();
  document.getElementById('recordMonth').value = getLocalMonthKey();
  changeLanguage();
  updateCurrentDateTime();
  window.setInterval(updateCurrentDateTime, 1000);
  document.getElementById('savedRecordMonth').addEventListener('change', updateSelectedRecordSummary);
  document.getElementById('recordsDialog').addEventListener('click', event => {
    if (event.target === document.getElementById('recordsDialog')) closeMonthlyRecords();
  });
  document.getElementById('reportForm').addEventListener('input', updateReportProjections);
  document.getElementById('reportForm').addEventListener('change', updateReportProjections);
  document.getElementById('reportTarget').addEventListener('input', () => { reportTargetCustomized = true; });
  document.getElementById('reportContributionFrequency').addEventListener('change', changeReportContributionFrequency);
  document.getElementById('reportDialog').addEventListener('click', event => {
    if (event.target === document.getElementById('reportDialog')) closeFinancialFreedomReport();
  });
});

// Built-in translations keep the interface available offline without API quotas.
const translations = {
  "en-ZA": {
    mainTitle: "Congratulations! You escaped the Rat Race", subTitle: "Automated Financial Freedom Tracker", lblIncome: "Income (After Tax)", btnPrint: "Download PDF", btnReset: "Reset Form", lblOverviewBills: "Bills (50%):", lblOverviewLifestyle: "Lifestyle (30%):", lblOverviewWealth: "Wealth (20%):", titleBills: "Bills Accounts (Essential Expenses)", lblTargetBills: "Bills Target Allocation (50%):", lblRent: "Rent / Mortgage Payment", lblWork: "Work & Commute Expenses", lblOtherBills: "Other Essential Bills", lblBillsBalText: "Bills Balance C/D:", titleLifestyle: "Lifestyle Accounts (Non-Essential Expenses)", lblTargetLifestyle: "Lifestyle Target Allocation (30%):", lblRolledBills: "Plus Bills Balance C/D:", lblFood: "Food Budget / Dining Out", lblLeisure: "Entertainment & Leisure", lblLifestyleBalText: "Lifestyle Balance B/D:", titleWealth: "Wealth Accounts (Investments & Allowances)", lblTargetWealth: "Wealth Target Allocation (20%):", lblRolledLifestyle: "Plus Lifestyle Balance B/D:", lblEmergency: "Emergency Fund Account (6 Months)", lblIndex: "Index Fund Investment Account", lblDebt: "Kill Debt Account (Loans, etc.)", lblWealthBalText: "Remaining Wealth Balance:", lblFreedomTitle: "YOUR FINANCIAL FREEDOM NUMBER IS:", lblFormulaText: "Calculation: (After-tax income − remaining wealth balance) × 12 × 25", btnAddBill: "+ Add Custom Bill", btnAddLifestyle: "+ Add Custom Lifestyle Item", btnAddWealth: "+ Add Custom Wealth Item"
  },
  "en-ZM": {
    mainTitle: "Congratulations! You escaped the Rat Race", subTitle: "Automated Financial Freedom Tracker", lblIncome: "Income (After Tax)", btnPrint: "Download PDF", btnReset: "Reset Form", lblOverviewBills: "Bills (50%):", lblOverviewLifestyle: "Lifestyle (30%):", lblOverviewWealth: "Wealth (20%):", titleBills: "Bills Accounts (Essential Expenses)", lblTargetBills: "Bills Target Allocation (50%):", lblRent: "Rent / Mortgage Payment", lblWork: "Work & Commute Expenses", lblOtherBills: "Other Essential Bills", lblBillsBalText: "Bills Balance C/D:", titleLifestyle: "Lifestyle Accounts (Non-Essential Expenses)", lblTargetLifestyle: "Lifestyle Target Allocation (30%):", lblRolledBills: "Plus Bills Balance C/D:", lblFood: "Food Budget / Dining Out", lblLeisure: "Entertainment & Leisure", lblLifestyleBalText: "Lifestyle Balance B/D:", titleWealth: "Wealth Accounts (Investments & Allowances)", lblTargetWealth: "Wealth Target Allocation (20%):", lblRolledLifestyle: "Plus Lifestyle Balance B/D:", lblEmergency: "Emergency Fund Account (6 Months)", lblIndex: "Index Fund Investment Account", lblDebt: "Kill Debt Account (Loans, etc.)", lblWealthBalText: "Remaining Wealth Balance:", lblFreedomTitle: "YOUR FINANCIAL FREEDOM NUMBER IS:", lblFormulaText: "Calculation: (After-tax income − remaining wealth balance) × 12 × 25", btnAddBill: "+ Add Custom Bill", btnAddLifestyle: "+ Add Custom Lifestyle Item", btnAddWealth: "+ Add Custom Wealth Item"
  },
  "af": {
    mainTitle: "Geluk! Jy het die 'Rat Race' ontsnap", subTitle: "Outomatiese Finansiële Vryheid Spoorder", lblIncome: "Inkomste (Na Belasting)", btnPrint: "Laai PDF af", btnReset: "Herstel Vorm", lblOverviewBills: "Rekeninge (50%):", lblOverviewLifestyle: "Lewenstyl (30%):", lblOverviewWealth: "Rykdom (20%):", titleBills: "Rekeninge (Noodsaaklike Uitgawes)", lblTargetBills: "Doelwit Toekenning (50%):", lblRent: "Huur- of Verbandbetaling", lblWork: "Werk- en Pendeluitgawes", lblOtherBills: "Ander Noodsaaklike Rekeninge", lblBillsBalText: "Rekeninge Balans C/D:", titleLifestyle: "Lewenstyl (Nie-Noodsaaklike Uitgawes)", lblTargetLifestyle: "Lewenstyl Toekenning (30%):", lblRolledBills: "Plus Rekeninge Balans C/D:", lblFood: "Voedselbegroting / Kos en Uiteet", lblLeisure: "Vermaak en Ontspanning", lblLifestyleBalText: "Lewenstyl Balans B/D:", titleWealth: "Rykdom (Investerings & Toelaes)", lblTargetWealth: "Rykdom Toekenning (20%):", lblRolledLifestyle: "Plus Lewenstyl Balans B/D:", lblEmergency: "Noodfondsrekening (6 Maande)", lblIndex: "Indeksfonds Beleggingsrekening", lblDebt: "Skuld-Doodmaak Rekening", lblWealthBalText: "Oorblywende Rykdom Balans:", lblFreedomTitle: "JOU FINANSIËLE VRYHEIDSNOMMER IS:", lblFormulaText: "Berekening: (Inkomste na belasting − oorblywende rykdomsaldo) × 12 × 25", btnAddBill: "+ Voeg Rekening By", btnAddLifestyle: "+ Voeg Lewenstyl Item By", btnAddWealth: "+ Voeg Rykdom Item By"
  },
  "zu": {
    mainTitle: "Halala! Weqe eMjahweni wamagundane", subTitle: "I-Automated Financial Freedom Tracker", lblIncome: "Imali engenayo (Ngemva kweNtela)", btnPrint: "Landa i-PDF", btnReset: "Setha kabusha", lblOverviewBills: "Izikolodo (50%):", lblOverviewLifestyle: "Indlela yokuphila (30%):", lblOverviewWealth: "Ingcebo (20%):", titleBills: "Izindleko ezibalulekile", lblTargetBills: "Isabelo Sezikolodo (50%):", lblRent: "Inkokhelo yeNdawo okanye iMali yomuzi", lblWork: "Izindleko zomsebenzi zokuHamba", lblOtherBills: "Ezinye izikolodo ezibalulekile", lblBillsBalText: "I-Bills Balance C/D:", titleLifestyle: "Izindleko zokuphila ezijwayelekile", lblTargetLifestyle: "Isabelo Zokuphila (30%):", lblRolledBills: "Kuhlanganise ne-Bills Balance C/D:", lblFood: "Imali yokudla neNdawo yokudla", lblLeisure: "Ezokuzijabulisa nezokuphumula", lblLifestyleBalText: "I-Lifestyle Balance B/D:", titleWealth: "Ingcebo (Utshalomali nezibonelelo)", lblTargetWealth: "Isabelo SeNgcebo (20%):", lblRolledLifestyle: "Kuhlanganise ne-Lifestyle Balance B/D:", lblEmergency: "Isikhwama Sezimo Ezisheshayo (Izinyanga ezi-6)", lblIndex: "I-Acounti yoTshalomali (Index Fund)", lblDebt: "Inkokhelo yezikolodo ezinkulu (Loans)", lblWealthBalText: "Ingcebo Eseleyo:", lblFreedomTitle: "INOMBOLO YAKHO YOKUKHULULEKA NGOKWEZIMALI IYI:", lblFormulaText: "Ukubala: (Imali engenayo ngemva kwentela − ibhalansi yengcebo esele) × 12 × 25", btnAddBill: "+ Faka enye iSikolodo", btnAddLifestyle: "+ Faka okwokuZijabulisa", btnAddWealth: "+ Faka okunye kweNgcebo"
  }
};

Object.assign(translations["en-ZA"], { lblLanguage: "Language", lblCurrencyRegion: "Currency Region", btnTheme: "Toggle dark theme", lblDaddyAllowance: "Daddy's Allowance", lblMommyAllowance: "Mommy's Allowance" });
Object.assign(translations["en-ZM"], { lblLanguage: "Language", lblCurrencyRegion: "Currency Region", btnTheme: "Toggle dark theme", lblDaddyAllowance: "Daddy's Allowance", lblMommyAllowance: "Mommy's Allowance" });
Object.assign(translations.af, { lblLanguage: "Taal", lblCurrencyRegion: "Geldeenheidstreek", btnTheme: "Wissel donker tema", placeholderItem: "Itemnaam", lblDaddyAllowance: "Pa se Toelae", lblMommyAllowance: "Ma se Toelae" });
Object.assign(translations.zu, { lblLanguage: "Ulimi", lblCurrencyRegion: "Isifunda Semali", btnTheme: "Shintsha itimu emnyama", placeholderItem: "Igama lento", lblDaddyAllowance: "Isibonelelo sikaBaba", lblMommyAllowance: "Isibonelelo sikaMama" });

const dateTimeLabels = {
  "en-ZA": "Local time", "en-ZM": "Local time", "en-US": "Local time",
  af: "Plaaslike tyd", zu: "Isikhathi sendawo", xh: "Ixesha lasekuhlaleni",
  st: "Nako ea lehae", es: "Hora local", fr: "Heure locale", de: "Ortszeit",
  zh: "当地时间", hi: "स्थानीय समय", ar: "التوقيت المحلي", pt: "Hora local",
  ru: "Местное время", ja: "現地時刻"
};

const monthlyRecordTranslations = {
  en: {
    heading: "Monthly Records", description: "Save dated snapshots in this browser, then reopen them later. Records stay on this device and are not synced to an account.",
    month: "Record month", save: "Save This Month", browse: "Browse Saved Records", savedHeading: "Saved Monthly Records",
    savedDescription: "Choose a month to review or load a saved budget snapshot.", savedMonth: "Saved month",
    load: "Load This Record", export: "Export Backup", import: "Import Backup", close: "Close"
  },
  af: {
    heading: "Maandelikse Rekords", description: "Stoor gedateerde rekords in hierdie blaaier en maak dit later weer oop. Rekords bly op hierdie toestel en word nie met 'n rekening gesinkroniseer nie.",
    month: "Rekordmaand", save: "Stoor Hierdie Maand", browse: "Bekyk Gestoorde Rekords", savedHeading: "Gestoorde Maandelikse Rekords",
    savedDescription: "Kies 'n maand om 'n gestoorde begrotingsrekord te bekyk of te laai.", savedMonth: "Gestoorde maand",
    load: "Laai Hierdie Rekord", export: "Voer Rugsteun Uit", import: "Voer Rugsteun In", close: "Sluit"
  },
  zu: {
    heading: "Amarekhodi Enyanga", description: "Gcina amarekhodi anedethi kulesi siphequluli ukuze uwavule kamuva. Ahlala kule divayisi futhi awavumelaniswanga ne-akhawunti.",
    month: "Inyanga yerekhodi", save: "Londoloza Le Nyanga", browse: "Phequlula Amarekhodi Alondoloziwe", savedHeading: "Amarekhodi Enyanga Alondoloziwe",
    savedDescription: "Khetha inyanga ukuze ubuke noma ulayishe irekhodi lesabelomali.", savedMonth: "Inyanga elondoloziwe",
    load: "Layisha Leli Rekhodi", export: "Khipha Ikhophi", import: "Ngenisa Ikhophi", close: "Vala"
  },
  es: {
    heading: "Registros mensuales", description: "Guarda instantáneas fechadas en este navegador para volver a abrirlas. Se quedan en este dispositivo y no se sincronizan con ninguna cuenta.",
    month: "Mes del registro", save: "Guardar este mes", browse: "Ver registros guardados", savedHeading: "Registros mensuales guardados",
    savedDescription: "Elige un mes para revisar o cargar un presupuesto guardado.", savedMonth: "Mes guardado",
    load: "Cargar este registro", export: "Exportar copia", import: "Importar copia", close: "Cerrar"
  },
  fr: {
    heading: "Archives mensuelles", description: "Enregistrez des instantanés datés dans ce navigateur pour les rouvrir plus tard. Ils restent sur cet appareil sans synchronisation de compte.",
    month: "Mois de l’archive", save: "Enregistrer ce mois", browse: "Parcourir les archives", savedHeading: "Archives mensuelles enregistrées",
    savedDescription: "Choisissez un mois pour consulter ou charger un budget enregistré.", savedMonth: "Mois enregistré",
    load: "Charger cette archive", export: "Exporter la sauvegarde", import: "Importer une sauvegarde", close: "Fermer"
  },
  de: {
    heading: "Monatsaufzeichnungen", description: "Speichere datierte Momentaufnahmen in diesem Browser, um sie später erneut zu öffnen. Die Daten bleiben auf diesem Gerät und werden nicht synchronisiert.",
    month: "Aufzeichnungsmonat", save: "Diesen Monat speichern", browse: "Gespeicherte Einträge ansehen", savedHeading: "Gespeicherte Monatsaufzeichnungen",
    savedDescription: "Wähle einen Monat aus, um einen gespeicherten Budgetstand anzusehen oder zu laden.", savedMonth: "Gespeicherter Monat",
    load: "Diesen Eintrag laden", export: "Sicherung exportieren", import: "Sicherung importieren", close: "Schließen"
  },
  pt: {
    heading: "Registos mensais", description: "Guarde cópias datadas neste navegador para as consultar mais tarde. Os registos ficam neste dispositivo e não são sincronizados com uma conta.",
    month: "Mês do registo", save: "Guardar este mês", browse: "Ver registos guardados", savedHeading: "Registos mensais guardados",
    savedDescription: "Escolha um mês para consultar ou carregar um orçamento guardado.", savedMonth: "Mês guardado",
    load: "Carregar este registo", export: "Exportar cópia", import: "Importar cópia", close: "Fechar"
  },
  zh: {
    heading: "月度记录", description: "将带日期的预算快照保存在此浏览器中，之后可重新查看。记录只保存在本设备，不会同步到账户。",
    month: "记录月份", save: "保存本月记录", browse: "浏览已保存记录", savedHeading: "已保存的月度记录",
    savedDescription: "选择月份以查看或载入已保存的预算快照。", savedMonth: "已保存月份",
    load: "载入此记录", export: "导出备份", import: "导入备份", close: "关闭"
  },
  hi: {
    heading: "मासिक रिकॉर्ड", description: "तारीख वाले बजट रिकॉर्ड इस ब्राउज़र में सहेजें और बाद में फिर खोलें। रिकॉर्ड इसी डिवाइस पर रहते हैं और किसी खाते से सिंक नहीं होते।",
    month: "रिकॉर्ड का महीना", save: "इस महीने का रिकॉर्ड सहेजें", browse: "सहेजे रिकॉर्ड देखें", savedHeading: "सहेजे गए मासिक रिकॉर्ड",
    savedDescription: "सहेजा गया बजट देखने या लोड करने के लिए महीना चुनें।", savedMonth: "सहेजा गया महीना",
    load: "यह रिकॉर्ड लोड करें", export: "बैकअप निर्यात करें", import: "बैकअप आयात करें", close: "बंद करें"
  },
  ar: {
    heading: "السجلات الشهرية", description: "احفظ نسخاً مؤرخة في هذا المتصفح للعودة إليها لاحقاً. تبقى السجلات على هذا الجهاز ولا تتم مزامنتها مع حساب.",
    month: "شهر السجل", save: "حفظ سجل هذا الشهر", browse: "استعراض السجلات المحفوظة", savedHeading: "السجلات الشهرية المحفوظة",
    savedDescription: "اختر شهراً لمراجعة ميزانية محفوظة أو تحميلها.", savedMonth: "الشهر المحفوظ",
    load: "تحميل هذا السجل", export: "تصدير نسخة احتياطية", import: "استيراد نسخة احتياطية", close: "إغلاق"
  },
  ru: {
    heading: "Месячные записи", description: "Сохраняйте датированные снимки бюджета в этом браузере и открывайте их позже. Записи остаются на устройстве и не синхронизируются с аккаунтом.",
    month: "Месяц записи", save: "Сохранить за этот месяц", browse: "Просмотреть сохранённые записи", savedHeading: "Сохранённые месячные записи",
    savedDescription: "Выберите месяц, чтобы просмотреть или загрузить сохранённый бюджет.", savedMonth: "Сохранённый месяц",
    load: "Загрузить эту запись", export: "Экспортировать резервную копию", import: "Импортировать резервную копию", close: "Закрыть"
  },
  ja: {
    heading: "月別記録", description: "日付付きの予算スナップショットをこのブラウザーに保存し、後から開けます。記録はこの端末内に保存され、アカウントとは同期されません。",
    month: "記録する月", save: "今月の記録を保存", browse: "保存済み記録を見る", savedHeading: "保存済みの月別記録",
    savedDescription: "保存した予算を確認または読み込む月を選択してください。", savedMonth: "保存済みの月",
    load: "この記録を読み込む", export: "バックアップをエクスポート", import: "バックアップをインポート", close: "閉じる"
  },
  xh: {
    heading: "Iirekhodi zeNyanga", description: "Gcina iikopi ezinedethi kwesi sikhangeli ukuze uzivule kwakhona. Iirekhodi zihlala kwesi sixhobo kwaye azingqamaniswa neakhawunti.",
    month: "Inyanga yerekhodi", save: "Gcina Le Nyanga", browse: "Jonga Iirekhodi Ezigciniweyo", savedHeading: "Iirekhodi zeNyanga Ezigciniweyo",
    savedDescription: "Khetha inyanga ukuze ujonge okanye ulayishe uhlahlo lwabiwo-mali olugciniweyo.", savedMonth: "Inyanga egciniweyo",
    load: "Layisha Le Rekhodi", export: "Thumela iKopi yoKhuseleko", import: "Ngenisa iKopi yoKhuseleko", close: "Vala"
  },
  st: {
    heading: "Lirekoto tsa Khoeli", description: "Boloka likopi tsa tekanyetso tse nang le letsatsi ka har'a sebatli sena hore u li bule hape hamorao. Lirekoto li sala sesebelisoeng sena 'me ha li hokahanngoe le ak'haonte.",
    month: "Khoeli ea rekoto", save: "Boloka Khoeli Ena", browse: "Sheba Lirekoto Tse Bolokiloeng", savedHeading: "Lirekoto Tsa Khoeli Tse Bolokiloeng",
    savedDescription: "Khetha khoeli ho bona kapa ho kenya tekanyetso e bolokiloeng.", savedMonth: "Khoeli e bolokiloeng",
    load: "Kenya Rekoto Ena", export: "Ntša Kopi ea Tšireletso", import: "Kenya Kopi ea Tšireletso", close: "Koala"
  }
};

const reportButtonLabels = {
  "en-ZA": "View Financial Freedom Report", "en-ZM": "View Financial Freedom Report", "en-US": "View Financial Freedom Report",
  af: "Bekyk Finansiële Vryheidsverslag", zu: "Buka Umbiko Wenkululeko Yezezimali",
  xh: "Jonga iNgxelo yeNkululeko yezeMali", st: "Sheba Tlaleho ea Tokoloho ea Lichelete",
  es: "Ver informe de libertad financiera", fr: "Voir le rapport de liberté financière",
  de: "Finanzielle-Freiheit-Bericht anzeigen", zh: "查看财务自由报告", hi: "वित्तीय स्वतंत्रता रिपोर्ट देखें",
  ar: "عرض تقرير الحرية المالية", pt: "Ver relatório de liberdade financeira",
  ru: "Посмотреть отчёт о финансовой независимости", ja: "経済的自由レポートを見る"
};

const reportLocaleStrings = {
  en: {
    title: "Financial Freedom & Investment Report", close: "Close",
    budget: "Your current budget snapshot", assumptions: "Projection assumptions",
    currencyIntro: "All projection amounts use", timingMonthly: ". Monthly contributions are invested at each month’s end.", timingWeekly: ". Weekly contributions are invested at each week’s end.",
    startingBalance: "Starting invested balance", target: "Financial Freedom Number target for this projection",
    contribution: "Monthly investment contribution", weeklyContribution: "Weekly investment contribution",
    contributionFrequency: "Contribution frequency", monthlyFrequency: "Monthly", weeklyFrequency: "Weekly",
    requiredContributionWeekly: "Required weekly contribution", annualFee: "Annual fund fee (%)",
    inflation: "Annual inflation assumption (%)", horizon: "Projection horizon (years)",
    headlineScenario: "Scenario used for time-to-target result", conservative: "Conservative",
    middle: "Middle", optimistic: "Optimistic", conservativeReturn: "Conservative gross return (% / year)",
    middleReturn: "Middle gross return (% / year)", optimisticReturn: "Optimistic gross return (% / year)",
    projection: "Illustrative compound-growth projection", yearHeading: "Year-by-year projected balances (nominal)",
    year: "Year", scenario: "Scenario", grossReturn: "Gross return", netReturn: "Net return after fee",
    requiredContribution: "Required monthly contribution", projectedValue: "Projected value at horizon",
    todayValue: "Value in today’s money", funds: "Examples of low-cost index funds and ETFs",
    print: "Print / Save as PDF", closeReport: "Close report"
  },
  af: {
    title: "Finansiële Vryheid- en Beleggingsverslag", close: "Sluit",
    budget: "Jou huidige begrotingsoorsig", assumptions: "Projeksie-aannames",
    currencyIntro: "Alle projeksiebedrae gebruik", timingMonthly: ". Maandelikse bydraes word aan die einde van elke maand belê.", timingWeekly: ". Weeklikse bydraes word aan die einde van elke week belê.",
    startingBalance: "Aanvangsbeleggingsaldo", target: "Finansiële Vryheidsnommer-teiken vir hierdie projeksie",
    contribution: "Maandelikse beleggingsbydrae", weeklyContribution: "Weeklikse beleggingsbydrae",
    contributionFrequency: "Bydraefrekwensie", monthlyFrequency: "Maandeliks", weeklyFrequency: "Weekliks",
    requiredContributionWeekly: "Vereiste weeklikse bydrae", annualFee: "Jaarlikse fondskoste (%)",
    inflation: "Jaarlikse inflasie-aanname (%)", horizon: "Projeksietydperk (jare)",
    headlineScenario: "Scenario vir tyd-tot-teiken-resultaat", conservative: "Konserwatief",
    middle: "Middel", optimistic: "Optimisties", conservativeReturn: "Konserwatiewe bruto opbrengs (% / jaar)",
    middleReturn: "Middel bruto opbrengs (% / jaar)", optimisticReturn: "Optimistiese bruto opbrengs (% / jaar)",
    projection: "Illustratiewe saamgestelde-groei-projeksie", yearHeading: "Geprojekteerde saldo per jaar (nominaal)",
    year: "Jaar", scenario: "Scenario", grossReturn: "Bruto opbrengs", netReturn: "Netto opbrengs ná koste",
    requiredContribution: "Benodigde maandelikse bydrae", projectedValue: "Geprojekteerde waarde aan die einde",
    todayValue: "Waarde in vandag se geld", funds: "Voorbeelde van laekoste-indeksfondse en ETF's",
    print: "Druk / Stoor as PDF", closeReport: "Sluit verslag"
  },
  zu: {
    title: "Umbiko Wenkululeko Yezezimali Nokutshalwa Kwezimali", close: "Vala",
    budget: "Isifinyezo sesabelomali sakho samanje", assumptions: "Imibono yesibikezelo",
    currencyIntro: "Zonke izibalo zesibikezelo zisebenzisa", timingMonthly: ". Iminikelo yanyanga zonke itshalwa ekupheleni kwenyanga.", timingWeekly: ". Iminikelo yamasonto onke itshalwa ekupheleni kwesonto.",
    startingBalance: "Imali yokuqala etshaliwe", target: "Inombolo Yenkululeko Yezezimali yalokhu kubikezela",
    contribution: "Umnikelo wokutshala wanyanga zonke", weeklyContribution: "Umnikelo wokutshala wamasonto onke",
    contributionFrequency: "Imvamisa yomnikelo", monthlyFrequency: "Nyanga zonke", weeklyFrequency: "Masonto onke",
    requiredContributionWeekly: "Umnikelo odingekayo wamasonto onke", annualFee: "Imali yonyaka yesikhwama (%)",
    inflation: "Isilinganiso sokwehla kwamandla emali (%)", horizon: "Isikhathi sesibikezelo (iminyaka)",
    headlineScenario: "Isimo esisetshenziselwa ukubala isikhathi", conservative: "Esokonga",
    middle: "Esimaphakathi", optimistic: "Esinethemba", conservativeReturn: "Imbuyiselo enkulu elinganiselayo (% / ngonyaka)",
    middleReturn: "Imbuyiselo enkulu emaphakathi (% / ngonyaka)", optimisticReturn: "Imbuyiselo enkulu enethemba (% / ngonyaka)",
    projection: "Isibikezelo sokukhula okuhlanganisiwe", yearHeading: "Ibhalansi ebikezelwe ngonyaka (ngaphambi kokulungisa)",
    year: "Unyaka", scenario: "Isimo", grossReturn: "Imbuyiselo enkulu", netReturn: "Imbuyiselo ngemva kwemali",
    requiredContribution: "Umnikelo odingekayo wanyanga zonke", projectedValue: "Inani elibikezelwe ekupheleni",
    todayValue: "Inani ngemali yanamuhla", funds: "Izibonelo zezimali ze-index ne-ETF ezinezindleko eziphansi",
    print: "Phrinta / Londoloza njenge-PDF", closeReport: "Vala umbiko"
  },
  es: {
    title: "Informe de libertad financiera e inversión", close: "Cerrar",
    budget: "Resumen de tu presupuesto actual", assumptions: "Supuestos de proyección",
    currencyIntro: "Todos los importes de la proyección usan", timingMonthly: ". Las aportaciones mensuales se invierten al final de cada mes.", timingWeekly: ". Las aportaciones semanales se invierten al final de cada semana.",
    startingBalance: "Saldo inicial invertido", target: "Objetivo del Número de Libertad Financiera para esta proyección",
    contribution: "Aportación mensual de inversión", weeklyContribution: "Aportación semanal de inversión",
    contributionFrequency: "Frecuencia de aportación", monthlyFrequency: "Mensual", weeklyFrequency: "Semanal",
    requiredContributionWeekly: "Aportación semanal necesaria", annualFee: "Comisión anual del fondo (%)",
    inflation: "Supuesto de inflación anual (%)", horizon: "Horizonte de proyección (años)",
    headlineScenario: "Escenario para calcular el tiempo hasta el objetivo", conservative: "Conservador",
    middle: "Intermedio", optimistic: "Optimista", conservativeReturn: "Rentabilidad bruta conservadora (% / año)",
    middleReturn: "Rentabilidad bruta intermedia (% / año)", optimisticReturn: "Rentabilidad bruta optimista (% / año)",
    projection: "Proyección ilustrativa de crecimiento compuesto", yearHeading: "Saldos proyectados por año (nominales)",
    year: "Año", scenario: "Escenario", grossReturn: "Rentabilidad bruta", netReturn: "Rentabilidad neta tras comisión",
    requiredContribution: "Aportación mensual necesaria", projectedValue: "Valor proyectado al final del plazo",
    todayValue: "Valor en dinero de hoy", funds: "Ejemplos de fondos indexados y ETF de bajo coste",
    print: "Imprimir / Guardar como PDF", closeReport: "Cerrar informe"
  },
  fr: {
    title: "Rapport sur la liberté financière et les investissements", close: "Fermer",
    budget: "Résumé de votre budget actuel", assumptions: "Hypothèses de projection",
    currencyIntro: "Tous les montants projetés utilisent", timingMonthly: ". Les versements mensuels sont investis en fin de mois.", timingWeekly: ". Les versements hebdomadaires sont investis en fin de semaine.",
    startingBalance: "Solde investi initial", target: "Objectif du nombre de liberté financière pour cette projection",
    contribution: "Versement mensuel d’investissement", weeklyContribution: "Versement hebdomadaire d’investissement",
    contributionFrequency: "Fréquence des versements", monthlyFrequency: "Mensuelle", weeklyFrequency: "Hebdomadaire",
    requiredContributionWeekly: "Versement hebdomadaire nécessaire", annualFee: "Frais annuels du fonds (%)",
    inflation: "Hypothèse d’inflation annuelle (%)", horizon: "Durée de projection (années)",
    headlineScenario: "Scénario utilisé pour calculer le délai", conservative: "Prudent",
    middle: "Intermédiaire", optimistic: "Optimiste", conservativeReturn: "Rendement brut prudent (% / an)",
    middleReturn: "Rendement brut intermédiaire (% / an)", optimisticReturn: "Rendement brut optimiste (% / an)",
    projection: "Projection illustrative de croissance composée", yearHeading: "Soldes projetés par année (nominaux)",
    year: "Année", scenario: "Scénario", grossReturn: "Rendement brut", netReturn: "Rendement net après frais",
    requiredContribution: "Versement mensuel nécessaire", projectedValue: "Valeur projetée à l’échéance",
    todayValue: "Valeur en monnaie actuelle", funds: "Exemples de fonds indiciels et ETF à faibles coûts",
    print: "Imprimer / Enregistrer en PDF", closeReport: "Fermer le rapport"
  },
  de: {
    title: "Bericht zu finanzieller Freiheit und Geldanlage", close: "Schließen",
    budget: "Übersicht des aktuellen Budgets", assumptions: "Annahmen für die Projektion",
    currencyIntro: "Alle Projektionsbeträge verwenden", timingMonthly: ". Monatliche Beiträge werden jeweils am Monatsende investiert.", timingWeekly: ". Wöchentliche Beiträge werden jeweils am Wochenende investiert.",
    startingBalance: "Anfangsanlagebetrag", target: "Zielwert der finanziellen Freiheit für diese Projektion",
    contribution: "Monatlicher Anlagebeitrag", weeklyContribution: "Wöchentlicher Anlagebeitrag",
    contributionFrequency: "Beitragshäufigkeit", monthlyFrequency: "Monatlich", weeklyFrequency: "Wöchentlich",
    requiredContributionWeekly: "Erforderlicher Wochenbeitrag", annualFee: "Jährliche Fondskosten (%)",
    inflation: "Annahme zur jährlichen Inflation (%)", horizon: "Projektionszeitraum (Jahre)",
    headlineScenario: "Szenario für die Berechnung der Zieldauer", conservative: "Konservativ",
    middle: "Mittel", optimistic: "Optimistisch", conservativeReturn: "Konservative Bruttorendite (% / Jahr)",
    middleReturn: "Mittlere Bruttorendite (% / Jahr)", optimisticReturn: "Optimistische Bruttorendite (% / Jahr)",
    projection: "Veranschaulichende Zinseszinsprojektion", yearHeading: "Projizierte Jahresendstände (nominal)",
    year: "Jahr", scenario: "Szenario", grossReturn: "Bruttorendite", netReturn: "Nettorendite nach Gebühren",
    requiredContribution: "Erforderlicher Monatsbeitrag", projectedValue: "Projizierter Wert am Laufzeitende",
    todayValue: "Wert in heutigem Geld", funds: "Beispiele kostengünstiger Indexfonds und ETFs",
    print: "Drucken / Als PDF speichern", closeReport: "Bericht schließen"
  },
  pt: {
    title: "Relatório de liberdade financeira e investimentos", close: "Fechar",
    budget: "Resumo do orçamento atual", assumptions: "Premissas da projeção",
    currencyIntro: "Todos os valores da projeção usam", timingMonthly: ". As contribuições mensais são investidas no fim de cada mês.", timingWeekly: ". As contribuições semanais são investidas no fim de cada semana.",
    startingBalance: "Saldo inicial investido", target: "Meta do Número de Liberdade Financeira para esta projeção",
    contribution: "Contribuição mensal de investimento", weeklyContribution: "Contribuição semanal de investimento",
    contributionFrequency: "Frequência da contribuição", monthlyFrequency: "Mensal", weeklyFrequency: "Semanal",
    requiredContributionWeekly: "Contribuição semanal necessária", annualFee: "Taxa anual do fundo (%)",
    inflation: "Premissa de inflação anual (%)", horizon: "Horizonte da projeção (anos)",
    headlineScenario: "Cenário usado para calcular o prazo", conservative: "Conservador",
    middle: "Intermediário", optimistic: "Otimista", conservativeReturn: "Retorno bruto conservador (% / ano)",
    middleReturn: "Retorno bruto intermediário (% / ano)", optimisticReturn: "Retorno bruto otimista (% / ano)",
    projection: "Projeção ilustrativa de crescimento composto", yearHeading: "Saldos projetados por ano (nominais)",
    year: "Ano", scenario: "Cenário", grossReturn: "Retorno bruto", netReturn: "Retorno líquido após taxa",
    requiredContribution: "Contribuição mensal necessária", projectedValue: "Valor projetado no fim do prazo",
    todayValue: "Valor em dinheiro de hoje", funds: "Exemplos de fundos de índice e ETFs de baixo custo",
    print: "Imprimir / Guardar como PDF", closeReport: "Fechar relatório"
  },
  zh: {
    title: "财务自由与投资报告", close: "关闭",
    budget: "当前预算摘要", assumptions: "预测假设",
    currencyIntro: "所有预测金额使用", timingMonthly: "。假设每月投入在每月月底投资。", timingWeekly: "。假设每周投入在每周末投资。",
    startingBalance: "初始投资余额", target: "本次预测的财务自由目标金额",
    contribution: "每月投资金额", weeklyContribution: "每周投资金额",
    contributionFrequency: "投入频率", monthlyFrequency: "每月", weeklyFrequency: "每周",
    requiredContributionWeekly: "所需每周投入", annualFee: "年度基金费用（%）",
    inflation: "年度通胀假设（%）", horizon: "预测期限（年）",
    headlineScenario: "用于计算达标时间的情景", conservative: "保守",
    middle: "中间", optimistic: "乐观", conservativeReturn: "保守年度总回报（%）",
    middleReturn: "中间年度总回报（%）", optimisticReturn: "乐观年度总回报（%）",
    projection: "复利增长示例预测", yearHeading: "逐年预测余额（名义金额）",
    year: "年", scenario: "情景", grossReturn: "总回报", netReturn: "扣除费用后的净回报",
    requiredContribution: "所需每月投入", projectedValue: "期限末预测价值",
    todayValue: "按当前货币价值计算", funds: "低成本指数基金和 ETF 示例",
    print: "打印 / 保存为 PDF", closeReport: "关闭报告"
  },
  hi: {
    title: "वित्तीय स्वतंत्रता और निवेश रिपोर्ट", close: "बंद करें",
    budget: "आपके वर्तमान बजट का सारांश", assumptions: "प्रक्षेपण की मान्यताएँ",
    currencyIntro: "सभी प्रक्षेपण राशियाँ इस मुद्रा में हैं", timingMonthly: "। मासिक योगदान हर महीने के अंत में निवेश किया जाता है।", timingWeekly: "। साप्ताहिक योगदान हर सप्ताह के अंत में निवेश किया जाता है।",
    startingBalance: "शुरुआती निवेश शेष", target: "इस प्रक्षेपण के लिए वित्तीय स्वतंत्रता लक्ष्य",
    contribution: "मासिक निवेश योगदान", weeklyContribution: "साप्ताहिक निवेश योगदान",
    contributionFrequency: "योगदान की आवृत्ति", monthlyFrequency: "मासिक", weeklyFrequency: "साप्ताहिक",
    requiredContributionWeekly: "आवश्यक साप्ताहिक योगदान", annualFee: "वार्षिक फंड शुल्क (%)",
    inflation: "वार्षिक मुद्रास्फीति मान्यता (%)", horizon: "प्रक्षेपण अवधि (वर्ष)",
    headlineScenario: "लक्ष्य तक समय के लिए परिदृश्य", conservative: "सावधान",
    middle: "मध्यम", optimistic: "आशावादी", conservativeReturn: "सावधान सकल रिटर्न (% / वर्ष)",
    middleReturn: "मध्यम सकल रिटर्न (% / वर्ष)", optimisticReturn: "आशावादी सकल रिटर्न (% / वर्ष)",
    projection: "उदाहरणात्मक चक्रवृद्धि वृद्धि प्रक्षेपण", yearHeading: "वर्ष-दर-वर्ष अनुमानित शेष (नाममात्र)",
    year: "वर्ष", scenario: "परिदृश्य", grossReturn: "सकल रिटर्न", netReturn: "शुल्क के बाद शुद्ध रिटर्न",
    requiredContribution: "आवश्यक मासिक योगदान", projectedValue: "अवधि के अंत में अनुमानित मूल्य",
    todayValue: "आज की मुद्रा में मूल्य", funds: "कम लागत वाले इंडेक्स फंड और ETF के उदाहरण",
    print: "प्रिंट / PDF के रूप में सहेजें", closeReport: "रिपोर्ट बंद करें"
  },
  ar: {
    title: "تقرير الحرية المالية والاستثمار", close: "إغلاق",
    budget: "ملخص ميزانيتك الحالية", assumptions: "افتراضات التوقع",
    currencyIntro: "جميع مبالغ التوقع تستخدم", timingMonthly: ". يُفترض استثمار المساهمات الشهرية في نهاية كل شهر.", timingWeekly: ". يُفترض استثمار المساهمات الأسبوعية في نهاية كل أسبوع.",
    startingBalance: "الرصيد المستثمر عند البداية", target: "هدف رقم الحرية المالية لهذا التوقع",
    contribution: "المساهمة الاستثمارية الشهرية", weeklyContribution: "المساهمة الاستثمارية الأسبوعية",
    contributionFrequency: "تكرار المساهمة", monthlyFrequency: "شهري", weeklyFrequency: "أسبوعي",
    requiredContributionWeekly: "المساهمة الأسبوعية المطلوبة", annualFee: "رسوم الصندوق السنوية (%)",
    inflation: "افتراض التضخم السنوي (%)", horizon: "مدة التوقع (سنوات)",
    headlineScenario: "السيناريو المستخدم لحساب المدة", conservative: "متحفظ",
    middle: "متوسط", optimistic: "متفائل", conservativeReturn: "العائد الإجمالي المتحفظ (% سنوياً)",
    middleReturn: "العائد الإجمالي المتوسط (% سنوياً)", optimisticReturn: "العائد الإجمالي المتفائل (% سنوياً)",
    projection: "توقع توضيحي للنمو المركب", yearHeading: "الأرصدة المتوقعة سنوياً (اسمية)",
    year: "السنة", scenario: "السيناريو", grossReturn: "العائد الإجمالي", netReturn: "العائد الصافي بعد الرسوم",
    requiredContribution: "المساهمة الشهرية المطلوبة", projectedValue: "القيمة المتوقعة عند نهاية المدة",
    todayValue: "القيمة بأموال اليوم", funds: "أمثلة على صناديق مؤشرات وصناديق ETF منخفضة التكلفة",
    print: "طباعة / حفظ كملف PDF", closeReport: "إغلاق التقرير"
  },
  ru: {
    title: "Отчёт о финансовой независимости и инвестициях", close: "Закрыть",
    budget: "Сводка текущего бюджета", assumptions: "Параметры прогноза",
    currencyIntro: "Все суммы прогноза указаны в", timingMonthly: ". Ежемесячные взносы инвестируются в конце каждого месяца.", timingWeekly: ". Еженедельные взносы инвестируются в конце каждой недели.",
    startingBalance: "Начальный инвестированный баланс", target: "Целевая сумма финансовой независимости для прогноза",
    contribution: "Ежемесячный инвестиционный взнос", weeklyContribution: "Еженедельный инвестиционный взнос",
    contributionFrequency: "Частота взносов", monthlyFrequency: "Ежемесячно", weeklyFrequency: "Еженедельно",
    requiredContributionWeekly: "Необходимый еженедельный взнос", annualFee: "Годовая комиссия фонда (%)",
    inflation: "Предположение об инфляции в год (%)", horizon: "Горизонт прогноза (лет)",
    headlineScenario: "Сценарий для расчёта срока достижения цели", conservative: "Консервативный",
    middle: "Средний", optimistic: "Оптимистичный", conservativeReturn: "Консервативная валовая доходность (% / год)",
    middleReturn: "Средняя валовая доходность (% / год)", optimisticReturn: "Оптимистичная валовая доходность (% / год)",
    projection: "Иллюстративный прогноз сложного роста", yearHeading: "Прогноз баланса по годам (номинально)",
    year: "Год", scenario: "Сценарий", grossReturn: "Валовая доходность", netReturn: "Чистая доходность после комиссии",
    requiredContribution: "Необходимый ежемесячный взнос", projectedValue: "Прогнозируемая сумма в конце срока",
    todayValue: "Сумма в сегодняшних деньгах", funds: "Примеры недорогих индексных фондов и ETF",
    print: "Печать / Сохранить в PDF", closeReport: "Закрыть отчёт"
  },
  ja: {
    title: "経済的自由・投資レポート", close: "閉じる",
    budget: "現在の予算概要", assumptions: "試算の前提",
    currencyIntro: "試算金額の通貨", timingMonthly: "。毎月の積立は月末に投資する前提です。", timingWeekly: "。毎週の積立は週末に投資する前提です。",
    startingBalance: "初期投資残高", target: "この試算の経済的自由目標額",
    contribution: "毎月の投資額", weeklyContribution: "毎週の投資額",
    contributionFrequency: "積立頻度", monthlyFrequency: "毎月", weeklyFrequency: "毎週",
    requiredContributionWeekly: "必要な毎週の投資額", annualFee: "年間ファンド費用（%）",
    inflation: "年間インフレ率の仮定（%）", horizon: "試算期間（年）",
    headlineScenario: "目標達成期間に使うシナリオ", conservative: "保守的",
    middle: "中間", optimistic: "楽観的", conservativeReturn: "保守的な年間総収益率（%）",
    middleReturn: "中間の年間総収益率（%）", optimisticReturn: "楽観的な年間総収益率（%）",
    projection: "複利成長の参考試算", yearHeading: "年ごとの予測残高（名目）",
    year: "年", scenario: "シナリオ", grossReturn: "総収益率", netReturn: "費用控除後の純収益率",
    requiredContribution: "必要な毎月の投資額", projectedValue: "期間終了時の予測額",
    todayValue: "現在価値換算", funds: "低コストのインデックスファンドとETFの例",
    print: "印刷 / PDFで保存", closeReport: "レポートを閉じる"
  },
  xh: {
    title: "Ingxelo yeNkululeko yezeMali notyalo-mali", close: "Vala",
    budget: "Isishwankathelo sohlahlo lwabiwo-mali lwangoku", assumptions: "Iingqikelelo zokuqikelela",
    currencyIntro: "Zonke iimali eziqikelelweyo zisebenzisa", timingMonthly: ". Iminikelo yenyanga ityalwa ekupheleni kwenyanga.", timingWeekly: ". Iminikelo yeveki ityalwa ekupheleni kweveki.",
    startingBalance: "Ibhalansi yokuqala etyaliweyo", target: "Injongo yeNombolo yeNkululeko yezeMali kolu qikelelo",
    contribution: "Igalelo lotyalo-mali lwenyanga", weeklyContribution: "Igalelo lotyalo-mali leveki",
    contributionFrequency: "Uphindaphindo lwegalelo", monthlyFrequency: "Ngenyanga", weeklyFrequency: "Ngeveki",
    requiredContributionWeekly: "Igalelo leveki elifunekayo", annualFee: "Intlawulo yonyaka yengxowa-mali (%)",
    inflation: "Ingqikelelo yokunyuka kwamaxabiso ngonyaka (%)", horizon: "Ixesha loqikelelo (iminyaka)",
    headlineScenario: "Imeko esetyenziselwa ukubala ixesha", conservative: "Elumkileyo",
    middle: "Ephakathi", optimistic: "Enethemba", conservativeReturn: "Imbuyekezo epheleleyo elumkileyo (% / ngonyaka)",
    middleReturn: "Imbuyekezo epheleleyo ephakathi (% / ngonyaka)", optimisticReturn: "Imbuyekezo epheleleyo enethemba (% / ngonyaka)",
    projection: "Uqikelelo lokukhula okuhlanganisiweyo", yearHeading: "Ibhalansi eqikelelweyo ngonyaka (yegama)",
    year: "Unyaka", scenario: "Imeko", grossReturn: "Imbuyekezo epheleleyo", netReturn: "Imbuyekezo emva kweentlawulo",
    requiredContribution: "Igalelo lenyanga elifunekayo", projectedValue: "Ixabiso eliqikelelweyo ekupheleni",
    todayValue: "Ixabiso ngemali yanamhlanje", funds: "Imizekelo yee-index fund nee-ETF ezinexabiso eliphantsi",
    print: "Shicilela / Gcina njenge-PDF", closeReport: "Vala ingxelo"
  },
  st: {
    title: "Tlaleho ea Tokoloho ea Lichelete le Matsete", close: "Koala",
    budget: "Kakaretso ea tekanyetso ea hau ea hajoale", assumptions: "Likhakanyo tsa ponelopele",
    currencyIntro: "Lichelete tsohle tsa ponelopele li sebelisa", timingMonthly: ". Menehelo ea khoeli le khoeli e tseteloa qetellong ea khoeli.", timingWeekly: ". Menehelo ea beke le beke e tseteloa qetellong ea beke.",
    startingBalance: "Chelete ea pele e tsetetsoeng", target: "Sepheo sa Nomoro ea Tokoloho ea Lichelete bakeng sa ponelopele ena",
    contribution: "Monehelo oa khoeli le khoeli oa matsete", weeklyContribution: "Monehelo oa beke le beke oa matsete",
    contributionFrequency: "Khafetsa ea monehelo", monthlyFrequency: "Khoeli le khoeli", weeklyFrequency: "Beke le beke",
    requiredContributionWeekly: "Monehelo oa beke le beke o hlokahalang", annualFee: "Tefiso ea selemo ea letlole (%)",
    inflation: "Khakanyo ea nyollo ea litheko ka selemo (%)", horizon: "Nako ea ponelopele (lilemo)",
    headlineScenario: "Boemo bo sebelisoang ho bala nako", conservative: "E hlokolosi",
    middle: "E bohareng", optimistic: "E nang le tšepo", conservativeReturn: "Puseletso e felletseng e hlokolosi (% / selemo)",
    middleReturn: "Puseletso e felletseng e bohareng (% / selemo)", optimisticReturn: "Puseletso e felletseng e nang le tšepo (% / selemo)",
    projection: "Ponelopele ea kholo e kopaneng", yearHeading: "Chelete e hakantsoeng selemo le selemo",
    year: "Selemo", scenario: "Boemo", grossReturn: "Puseletso e felletseng", netReturn: "Puseletso ka mor'a tefiso",
    requiredContribution: "Monehelo oa khoeli le khoeli o hlokahalang", projectedValue: "Boleng bo hakantsoeng qetellong",
    todayValue: "Boleng ka chelete ea kajeno", funds: "Mehlala ea li-index fund le ETF tse theko e tlase",
    print: "Hatisa / Boloka e le PDF", closeReport: "Koala tlaleho"
  }
};

const reportSummaryLabels = {
  en: ["Monthly after-tax income", "Bills expenses", "Lifestyle expenses", "Wealth allocations and outflows", "Remaining Wealth balance", "Financial Freedom Number"],
  af: ["Maandelikse inkomste ná belasting", "Rekeninguitgawes", "Lewenstyluitgawes", "Rykdomstoekennings en uitvloei", "Oorblywende Rykdomsaldo", "Finansiële Vryheidsnommer"],
  zu: ["Imali engenayo yanyanga zonke ngemva kwentela", "Izindleko zezikweletu", "Izindleko zendlela yokuphila", "Izabelo nengcebo ephumayo", "Ibhalansi yengcebo esele", "Inombolo Yenkululeko Yezezimali"],
  es: ["Ingresos mensuales después de impuestos", "Gastos esenciales", "Gastos de estilo de vida", "Asignaciones y salidas de patrimonio", "Saldo restante de patrimonio", "Número de Libertad Financiera"],
  fr: ["Revenu mensuel après impôts", "Dépenses essentielles", "Dépenses de style de vie", "Affectations et sorties de patrimoine", "Solde de patrimoine restant", "Nombre de liberté financière"],
  de: ["Monatliches Nettoeinkommen", "Grundausgaben", "Lebenshaltungsausgaben", "Vermögenszuweisungen und -abflüsse", "Verbleibendes Vermögen", "Finanzielle Freiheitszahl"],
  pt: ["Rendimento mensal após impostos", "Despesas essenciais", "Despesas de estilo de vida", "Alocações e saídas de patrimônio", "Saldo patrimonial restante", "Número de Liberdade Financeira"],
  zh: ["月税后收入", "基本支出", "生活方式支出", "财富分配与支出", "剩余财富余额", "财务自由目标金额"],
  hi: ["मासिक कर-पश्चात आय", "आवश्यक खर्च", "जीवनशैली खर्च", "संपत्ति आवंटन और निकासी", "शेष संपत्ति राशि", "वित्तीय स्वतंत्रता संख्या"],
  ar: ["الدخل الشهري بعد الضريبة", "النفقات الأساسية", "نفقات أسلوب الحياة", "تخصيصات الأصول والمصروفات", "رصيد الأصول المتبقي", "رقم الحرية المالية"],
  ru: ["Ежемесячный доход после налогов", "Основные расходы", "Расходы на образ жизни", "Распределение и отток средств", "Остаток средств", "Целевая сумма финансовой независимости"],
  ja: ["月間税引後収入", "必須支出", "生活費", "資産配分と支出", "残りの資産残高", "経済的自由の目標額"],
  xh: ["Ingeniso yenyanga emva kwerhafu", "Iindleko eziyimfuneko", "Iindleko zendlela yokuphila", "Ulwabiwo nobutyebi obuphumayo", "Ibhalansi yobutyebi eseleyo", "Inombolo yeNkululeko yezeMali"],
  st: ["Chelete ea khoeli ka mor'a lekhetho", "Litšenyehelo tsa bohlokoa", "Litšenyehelo tsa bophelo", "Kabo le chelete e tsoang leruong", "Chelete e setseng ea leruo", "Nomoro ea Tokoloho ea Lichelete"]
};

const reportTimeTemplates = {
  en: { reached: "It Would Take Approximately {years} Years to Reach Your {amount} Financial Freedom Number", unreachable: "It Would Not Reach Your {amount} Financial Freedom Number Under These Inputs." },
  af: { reached: "Dit Sal Ongeveer {years} Jaar Neem om Jou Finansiële Vryheidsnommer van {amount} te Bereik", unreachable: "Jou Finansiële Vryheidsnommer van {amount} Sal Nie met Hierdie Insette Bereik Word Nie." },
  zu: { reached: "Kungathatha Iminyaka Engaba ngu-{years} Ukufinyelela Inombolo Yakho Yenkululeko Yezezimali engu-{amount}", unreachable: "Inombolo Yakho Yenkululeko Yezezimali engu-{amount} Ayifinyeleleki Ngalezi Zibalo." },
  es: { reached: "Se Tardarían Aproximadamente {years} Años en Alcanzar tu Número de Libertad Financiera de {amount}", unreachable: "No Se Alcanzaría tu Número de Libertad Financiera de {amount} con estos datos." },
  fr: { reached: "Il Faudrait Environ {years} Ans pour Atteindre Votre Nombre de Liberté Financière de {amount}", unreachable: "Votre objectif de liberté financière de {amount} ne serait pas atteint avec ces données." },
  de: { reached: "Es Würde Ungefähr {years} Jahre Dauern, Ihre Finanzielle Freiheitszahl von {amount} zu Erreichen", unreachable: "Ihre Finanzielle Freiheitszahl von {amount} wird mit diesen Eingaben nicht erreicht." },
  pt: { reached: "Levaria Aproximadamente {years} Anos para Alcançar seu Número de Liberdade Financeira de {amount}", unreachable: "Seu objetivo de liberdade financeira de {amount} não seria alcançado com estes dados." },
  zh: { reached: "预计需要约 {years} 年达到您的财务自由目标金额 {amount}", unreachable: "按当前输入无法达到您的财务自由目标金额 {amount}。" },
  hi: { reached: "आपके {amount} वित्तीय स्वतंत्रता लक्ष्य तक पहुँचने में लगभग {years} वर्ष लगेंगे", unreachable: "इन मान्यताओं के आधार पर {amount} का लक्ष्य प्राप्त नहीं होगा।" },
  ar: { reached: "سيستغرق الوصول إلى هدف الحرية المالية البالغ {amount} حوالي {years} سنة", unreachable: "لن يتم بلوغ هدف الحرية المالية البالغ {amount} وفق هذه المدخلات." },
  ru: { reached: "Для достижения цели финансовой независимости {amount} потребуется примерно {years} лет", unreachable: "При этих исходных данных цель {amount} не будет достигнута." },
  ja: { reached: "経済的自由の目標額 {amount} に到達するまで約 {years} 年かかります", unreachable: "この入力条件では目標額 {amount} に到達できません。" },
  xh: { reached: "Kuya kuthatha malunga neminyaka eyi-{years} ukufikelela kwiNombolo yeNkululeko yezeMali eyi-{amount}", unreachable: "Injongo yeNkululeko yezeMali eyi-{amount} ayinakufikelelwa ngale datha." },
  st: { reached: "Ho ka nka lilemo tse ka bang {years} ho fihlela Nomoro ea Tokoloho ea Lichelete ea {amount}", unreachable: "Sepheo sa {amount} se ke ke sa fihlelleha ka lintlha tsena." }
};

const reportNoticeTranslations = {
  en: {
    disclaimer: "This report is generated entirely in your browser. It uses illustrative assumptions, not predictions or investment advice. Past performance does not guarantee future results.",
    formula: "Your budget’s Financial Freedom Number is calculated as (after-tax income − remaining Wealth balance) × 12 × 25.",
    target: "This projection target is editable and separate from the app-calculated number above. The budget formula includes all Wealth inputs; retirement spending may differ.",
    method: "Projection target: {target}. The annual fee ({fee}%) is subtracted from each gross return. Compounding is calculated per contribution period, with deposits at period-end. Today's value adjusts for {inflation}% inflation. Taxes and market volatility are not modeled; scenarios are illustrative, not forecasts.",
    time: "Time estimate uses {scenario} ({rate}% gross annual return less {fee}% fee), with the starting balance and contribution frequency and amount shown above.",
    funds: "These examples cover different markets; they are not interchangeable recommendations. Fees, availability, taxes, domicile, and currency exposure vary. No live fund data is loaded; check issuer details."
  },
  af: {
    disclaimer: "Hierdie verslag word geheel en al in jou blaaier geskep. Die aannames is illustratief, nie voorspellings of beleggingsadvies nie. Vorige prestasie waarborg nie toekomstige resultate nie.",
    formula: "Jou begroting se Finansiële Vryheidsnommer word bereken as (inkomste ná belasting − oorblywende Rykdomsaldo) × 12 × 25.",
    target: "Hierdie projeksieteiken kan onafhanklik verander word en wysig nie die toepassing se nommer hierbo nie. Aftree-uitgawes kan van die huidige begroting verskil.",
    method: "Projeksieteiken: {target}. Die jaarlikse koste ({fee}%) word van elke bruto opbrengs afgetrek. Groei word per bydraetydperk saamgestel, met bydraes aan die einde van elke tydperk. Vandag se waarde pas {inflation}% inflasie toe. Belasting en markskommelings is nie ingesluit nie; scenario's is illustratief.",
    time: "Die tydskatting gebruik die {scenario}-scenario ({rate}% bruto jaaropbrengs minus {fee}% koste), met die aanvangsaldo en bydraefrekwensie en -bedrag hierbo.",
    funds: "Hierdie voorbeelde dek verskillende markte en is nie uitruilbare aanbevelings nie. Koste, beskikbaarheid, belasting en geldeenheidblootstelling verskil. Geen regstreekse fondsdata word gelaai nie."
  },
  zu: {
    disclaimer: "Lo mbiko wenziwa kusiphequluli sakho. Lezi izibalo ziyizibonelo, akuzona izibikezelo noma iseluleko sokutshala. Imiphumela yakudala ayiqinisekisi ikusasa.",
    formula: "Inombolo Yenkululeko Yezezimali yesabelomali sakho ibalwa kanje: (imali engenayo ngemva kwentela − ibhalansi yengcebo esele) × 12 × 25.",
    target: "Ungashintsha le nhloso yesibikezelo ngaphandle kokushintsha inombolo yesabelomali engenhla. Izindleko zomhlalaphansi zingahluka kwesamanje.",
    method: "Inhloso yesibikezelo: {target}. Imali yonyaka ({fee}%) iyasuswa embuyiselweni enkulu. Inzalo ibalwa ngesikhathi ngasinye somnikelo, kanti iminikelo ifakwa ekupheleni kwaso. Inani lanamuhla lilungiswa ngo-{inflation}% wokwehla kwamandla emali. Izintela nokuguquguquka kwemakethe akufakiwe.",
    time: "Isikhathi sisebenzisa isimo esithi {scenario} (imbuyiselo enkulu yonyaka engu-{rate}% kususwe imali engu-{fee}%), kanye nebhalansi yokuqala nemvamisa nenani lomnikelo ongenhla.",
    funds: "Lezi zibonelo zimboza izimakethe ezahlukene futhi azifani. Izindleko, ukutholakala, izintela nemali kuyahlukahluka. Ayikho idatha yesikhwama ebukhoma elayishwayo."
  },
  es: {
    disclaimer: "Este informe se genera íntegramente en tu navegador. Usa supuestos ilustrativos, no predicciones ni asesoramiento financiero. La rentabilidad pasada no garantiza resultados futuros.",
    formula: "El Número de Libertad Financiera de tu presupuesto se calcula así: (ingresos después de impuestos − saldo restante de patrimonio) × 12 × 25.",
    target: "Este objetivo de proyección se puede cambiar sin modificar el número calculado por la aplicación. Los gastos durante la jubilación pueden ser distintos.",
    method: "Objetivo: {target}. La comisión anual ({fee}%) se resta de cada rentabilidad bruta. La capitalización se calcula por periodo de aportación, con depósitos al final de cada periodo. El valor actual descuenta una inflación del {inflation}%. No se modelan impuestos ni volatilidad; son escenarios ilustrativos, no previsiones.",
    time: "El plazo usa el escenario {scenario} ({rate}% de rentabilidad bruta anual menos {fee}% de comisión), con el saldo inicial y la frecuencia e importe de aportación indicados.",
    funds: "Estos ejemplos abarcan mercados distintos y no son recomendaciones intercambiables. Varían las comisiones, disponibilidad, impuestos y divisa. No se cargan datos actuales; consulta al emisor."
  },
  fr: {
    disclaimer: "Ce rapport est généré entièrement dans votre navigateur. Il utilise des hypothèses illustratives, pas des prévisions ni des conseils financiers. Les performances passées ne garantissent pas les résultats futurs.",
    formula: "Le nombre de liberté financière du budget est calculé ainsi : (revenu après impôts − solde de patrimoine restant) × 12 × 25.",
    target: "Cet objectif de projection est modifiable sans changer le nombre calculé par l’application. Les dépenses à la retraite peuvent différer.",
    method: "Objectif : {target}. Les frais annuels ({fee}%) sont soustraits de chaque rendement brut. La capitalisation suit la fréquence des versements, effectués en fin de période. La valeur actuelle tient compte d’une inflation de {inflation}%. Les impôts et la volatilité ne sont pas modélisés ; ce sont des scénarios illustratifs.",
    time: "Le délai utilise le scénario {scenario} (rendement brut annuel de {rate}%, moins {fee}% de frais), avec le solde initial et la fréquence et le montant des versements indiqués.",
    funds: "Ces exemples couvrent différents marchés et ne sont pas des recommandations interchangeables. Frais, disponibilité, fiscalité et devises varient. Aucune donnée en direct n’est chargée ; vérifiez auprès de l’émetteur."
  },
  de: {
    disclaimer: "Dieser Bericht wird vollständig im Browser erstellt. Er verwendet beispielhafte Annahmen, keine Prognosen oder Anlageberatung. Vergangene Wertentwicklungen garantieren keine zukünftigen Ergebnisse.",
    formula: "Die finanzielle Freiheitszahl des Budgets wird so berechnet: (Nettoeinkommen − verbleibendes Vermögen) × 12 × 25.",
    target: "Dieses Projektionsziel lässt sich ändern, ohne die von der App berechnete Zahl oben zu verändern. Ausgaben im Ruhestand können abweichen.",
    method: "Projektionsziel: {target}. Die Jahresgebühr ({fee}%) wird von jeder Bruttorendite abgezogen. Die Verzinsung erfolgt je Beitragszeitraum, Beiträge am jeweiligen Periodenende. Der heutige Wert berücksichtigt {inflation}% Inflation. Steuern und Marktschwankungen sind nicht modelliert; die Szenarien dienen nur der Illustration.",
    time: "Die Zeitangabe basiert auf dem Szenario „{scenario}“ ({rate}% Bruttorendite jährlich abzüglich {fee}% Gebühr) sowie dem angegebenen Anfangsbestand und der Beitragsfrequenz und -höhe.",
    funds: "Diese Beispiele bilden unterschiedliche Märkte ab und sind keine austauschbaren Empfehlungen. Gebühren, Verfügbarkeit, Steuern und Währungsrisiken variieren. Es werden keine Live-Daten geladen."
  },
  pt: {
    disclaimer: "Este relatório é gerado inteiramente no navegador. Usa premissas ilustrativas, não previsões nem aconselhamento financeiro. O desempenho passado não garante resultados futuros.",
    formula: "O Número de Liberdade Financeira do orçamento é calculado assim: (rendimento após impostos − saldo patrimonial restante) × 12 × 25.",
    target: "Esta meta de projeção pode ser alterada sem modificar o número calculado pela aplicação. Os gastos na aposentadoria podem ser diferentes.",
    method: "Meta: {target}. A taxa anual ({fee}%) é subtraída de cada retorno bruto. A capitalização acompanha cada período de contribuição, com depósitos no fim do período. O valor atual considera inflação de {inflation}%. Impostos e volatilidade não são modelados; os cenários são ilustrativos.",
    time: "O prazo usa o cenário {scenario} (retorno bruto anual de {rate}% menos taxa de {fee}%), com o saldo inicial e a frequência e o valor da contribuição informados.",
    funds: "Estes exemplos abrangem mercados diferentes e não são recomendações intercambiáveis. Taxas, disponibilidade, impostos e moeda variam. Não há dados ao vivo; confirme com o emissor."
  },
  zh: {
    disclaimer: "本报告完全在浏览器中生成。所有假设仅供演示，不构成预测或投资建议；过去的表现不代表未来结果。",
    formula: "预算中的财务自由目标金额按以下公式计算：（税后收入 − 剩余财富余额）× 12 × 25。",
    target: "此处可单独修改预测目标，不会改变上方应用计算的金额。退休后的支出可能与当前预算不同。",
    method: "预测目标：{target}。年度费用（{fee}%）从各情景总回报中扣除；按投入周期复利，并在每个周期末投入。当前价值按 {inflation}% 通胀调整。未计入税费或市场波动；情景仅供参考，并非预测。",
    time: "达标时间采用“{scenario}”情景（年度总回报 {rate}%，扣除 {fee}% 费用），并使用上方的初始余额和每月投入。",
    funds: "这些示例覆盖不同市场，不能互相替代或视为推荐。费用、可用性、税务和货币风险因地区而异。本报告不加载实时基金数据，请向发行方核实。"
  },
  hi: {
    disclaimer: "यह रिपोर्ट पूरी तरह आपके ब्राउज़र में बनती है। अनुमान केवल उदाहरण हैं, भविष्यवाणी या निवेश सलाह नहीं। पिछला प्रदर्शन भविष्य के परिणाम की गारंटी नहीं देता।",
    formula: "बजट का वित्तीय स्वतंत्रता नंबर इस प्रकार है: (कर-पश्चात आय − शेष संपत्ति) × 12 × 25।",
    target: "इस प्रक्षेपण लक्ष्य को बदलने से ऊपर दिखाया गया ऐप का नंबर नहीं बदलता। सेवानिवृत्ति के खर्च अलग हो सकते हैं।",
    method: "लक्ष्य: {target}। वार्षिक शुल्क ({fee}%) सकल रिटर्न से घटाया जाता है। चक्रवृद्धि चुनी गई योगदान अवधि के अनुसार और योगदान अवधि के अंत में माना गया है। आज का मूल्य {inflation}% मुद्रास्फीति से समायोजित है। कर और बाजार उतार-चढ़ाव शामिल नहीं हैं; ये उदाहरण हैं, पूर्वानुमान नहीं।",
    time: "समय का अनुमान {scenario} परिदृश्य ({rate}% सकल वार्षिक रिटर्न में से {fee}% शुल्क घटाकर), शुरुआती शेष और ऊपर दी गई योगदान आवृत्ति और राशि पर आधारित है।",
    funds: "ये उदाहरण अलग-अलग बाजारों के हैं और एक-दूसरे के विकल्प या सिफारिश नहीं हैं। शुल्क, उपलब्धता, कर और मुद्रा जोखिम अलग हो सकते हैं। लाइव डेटा लोड नहीं होता; जारीकर्ता से जाँचें।"
  },
  ar: {
    disclaimer: "يُنشأ هذا التقرير بالكامل في متصفحك. الافتراضات توضيحية وليست توقعات أو نصيحة استثمارية. الأداء السابق لا يضمن النتائج المستقبلية.",
    formula: "يُحسب رقم الحرية المالية في ميزانيتك كالتالي: (الدخل بعد الضريبة − رصيد الأصول المتبقي) × 12 × 25.",
    target: "يمكن تعديل هدف التوقع دون تغيير الرقم الذي حسبه التطبيق أعلاه. قد تختلف نفقات التقاعد عن الميزانية الحالية.",
    method: "الهدف: {target}. تُخصم الرسوم السنوية ({fee}%) من العائد الإجمالي. يُحسب النمو وفق فترة المساهمة، وتضاف المساهمات في نهاية كل فترة. تُعدّل القيمة الحالية وفق تضخم {inflation}%. لا تُحتسب الضرائب أو تقلبات السوق؛ السيناريوهات توضيحية وليست توقعات.",
    time: "يستخدم تقدير المدة السيناريو {scenario} (عائد سنوي إجمالي {rate}% بعد خصم رسوم {fee}%) والرصيد الأولي وتكرار المساهمة ومبلغها أعلاه.",
    funds: "تغطي هذه الأمثلة أسواقاً مختلفة وليست توصيات قابلة للاستبدال. تختلف الرسوم والتوافر والضرائب والعملات. لا تُحمّل بيانات مباشرة؛ تحقق من الجهة المصدرة."
  },
  ru: {
    disclaimer: "Отчёт полностью формируется в браузере. Параметры приведены для примера, это не прогноз и не инвестиционная рекомендация. Прошлая доходность не гарантирует будущих результатов.",
    formula: "Целевая сумма финансовой независимости в бюджете рассчитывается так: (доход после налогов − остаток средств) × 12 × 25.",
    target: "Цель прогноза можно менять независимо от суммы, рассчитанной приложением выше. Расходы на пенсии могут отличаться.",
    method: "Цель: {target}. Годовая комиссия ({fee}%) вычитается из валовой доходности. Начисление выполняется за каждый период взносов, которые вносятся в конце периода. Текущая стоимость учитывает инфляцию {inflation}%. Налоги и колебания рынка не учитываются; сценарии иллюстративны.",
    time: "Срок рассчитан по сценарию «{scenario}» (валовая доходность {rate}% в год за вычетом комиссии {fee}%) с указанными начальным балансом, частотой и суммой взносов.",
    funds: "Примеры охватывают разные рынки и не являются взаимозаменяемыми рекомендациями. Комиссии, доступность, налоги и валютные риски различаются. Актуальные данные не загружаются."
  },
  ja: {
    disclaimer: "このレポートはブラウザー内で生成されます。前提は参考例であり、予測や投資助言ではありません。過去の実績は将来の成果を保証しません。",
    formula: "予算の経済的自由目標額は（税引後収入 − 残りの資産残高）× 12 × 25 で計算されます。",
    target: "試算目標額は個別に変更でき、上記のアプリ計算額には影響しません。退職後の支出は現在と異なる場合があります。",
    method: "目標額：{target}。年間費用（{fee}%）を各総収益率から差し引きます。選択した積立期間ごとに複利計算し、各期間の末に積み立てます。現在価値はインフレ率 {inflation}% で調整。税金や市場変動は含まず、予測ではなく参考試算です。",
    time: "期間は「{scenario}」シナリオ（年間総収益率 {rate}% から費用 {fee}% を控除）と、上記の初期残高・積立頻度・金額に基づきます。",
    funds: "これらは異なる市場の例であり、相互に代替できる推奨商品ではありません。費用、取扱地域、税制、通貨リスクは異なります。最新データは発行元で確認してください。"
  },
  xh: {
    disclaimer: "Le ngxelo yenziwa kwisikhangeli sakho. Iingqikelelo ziyimizekelo, azizizo izibikezelo okanye iingcebiso zotyalo-mali. Iziphumo zangaphambili aziqinisekisi ezexesha elizayo.",
    formula: "Inombolo yeNkululeko yezeMali yohlahlo lwabiwo-mali ibalwa ngolu hlobo: (ingeniso emva kwerhafu − ibhalansi yobutyebi eseleyo) × 12 × 25.",
    target: "Ungayitshintsha ngokwahlukeneyo injongo yoqikelelo ngaphandle kokutshintsha inombolo ebalwe lusetyenziso engentla. Iindleko zomhlalaphantsi zinokwahluka.",
    method: "Injongo: {target}. Intlawulo yonyaka ({fee}%) iyasuswa kwimbuyekezo epheleleyo. Ukukhula kubalwa ngokwexesha lomnikelo, neminikelo ifakwa ekupheleni kwexesha ngalinye. Ixabiso lanamhlanje lilungiswa nge-{inflation}% yokunyuka kwamaxabiso. Iirhafu nokuguquguquka kwemarike akubalwa; ezi ziimeko zemizekelo.",
    time: "Ixesha lisebenzisa imeko ethi {scenario} (imbuyekezo epheleleyo yonyaka eyi-{rate}% kususwe intlawulo eyi-{fee}%), nebhalansi yokuqala, ukuphindaphinda nomlinganiselo womnikelo ongentla.",
    funds: "Le mizekelo imalunga neemarike ezahlukeneyo, ayizizo iingcebiso ezifanayo. Iintlawulo, ukufumaneka, iirhafu nemali zinokwahluka. Akukho datha yangoku ilayishwayo."
  },
  st: {
    disclaimer: "Tlaleho ena e etsoa ka har'a sebatli sa hau. Likhakanyo ke mehlala, ha se likhakanyo tsa bokamoso kapa likeletso tsa matsete. Liphetho tsa khale ha li tiise tsa kamoso.",
    formula: "Nomoro ea Tokoloho ea Lichelete ea tekanyetso e baloa tjena: (chelete ka mor'a lekhetho − leruo le setseng) × 12 × 25.",
    target: "Sepheo sa ponelopele se ka fetoloa ntle le ho fetola nomoro e baliloeng ke sesebelisoa e kaholimo. Litšenyehelo tsa ho tlohela mosebetsi li ka fapana.",
    method: "Sepheo: {target}. Tefiso ea selemo ({fee}%) e tlosoa pusetsong e felletseng. Khōlo e baloa nakong ka 'ngoe ea monehelo, 'me menehelo e eketsoa qetellong ea nako eo. Boleng ba kajeno bo lokisoa ka nyollo ea litheko ea {inflation}%. Makhetho le liphetoho tsa mmaraka ha li kenyelletsoe; ena ke mehlala feela.",
    time: "Nako e sebelisa boemo ba {scenario} (puseletso e felletseng ea selemo ea {rate}% ho tlositsoe tefiso ea {fee}%), chelete ea pele, khafetsa le boholo ba monehelo o kaholimo.",
    funds: "Mehlala ena e akaretsa limmaraka tse fapaneng, ha se likhothaletso tse ka nkelanang sebaka. Litefiso, phihlello, lekhetho le chelete lia fapana. Ha ho data ea hajoale e jarolloang."
  }
};

const translationKeys = [
  "mainTitle", "subTitle", "lblLanguage", "lblCurrencyRegion", "btnTheme", "lblIncome",
  "btnPrint", "btnReset", "lblOverviewBills", "lblOverviewLifestyle", "lblOverviewWealth",
  "titleBills", "lblTargetBills", "lblRent", "lblWork", "lblOtherBills", "lblBillsBalText",
  "titleLifestyle", "lblTargetLifestyle", "lblRolledBills", "lblFood", "lblLeisure",
  "lblLifestyleBalText", "titleWealth", "lblTargetWealth", "lblRolledLifestyle",
  "lblEmergency", "lblIndex", "lblDebt", "lblWealthBalText", "lblFreedomTitle",
  "lblFormulaText", "btnAddBill", "btnAddLifestyle", "btnAddWealth", "placeholderItem",
  "lblDaddyAllowance", "lblMommyAllowance"
];

const localeRows = {
  es: [
    "¡Felicidades! Has escapado de la carrera de la rata", "Planificador automático de libertad financiera", "Idioma", "Moneda", "Cambiar tema oscuro", "Ingresos (después de impuestos)",
    "Descargar PDF", "Restablecer formulario", "Facturas (50%):", "Estilo de vida (30%):", "Patrimonio (20%):",
    "Gastos esenciales", "Asignación para facturas (50%):", "Alquiler / Hipoteca", "Gastos de trabajo y transporte", "Otras facturas esenciales", "Saldo de facturas C/D:",
    "Estilo de vida (gastos no esenciales)", "Asignación para estilo de vida (30%):", "Más saldo de facturas C/D:", "Presupuesto de comida / Comer fuera", "Entretenimiento y ocio",
    "Saldo de estilo de vida B/D:", "Patrimonio (inversiones y asignaciones)", "Asignación para patrimonio (20%):", "Más saldo de estilo de vida B/D:",
    "Fondo de emergencia (6 meses)", "Cuenta de inversión en fondos indexados", "Cuenta para pagar deudas (préstamos, etc.)", "Saldo restante del patrimonio:", "TU NÚMERO DE LIBERTAD FINANCIERA ES:",
    "Cálculo: (ingresos después de impuestos − saldo restante del patrimonio) × 12 × 25", "+ Añadir factura personalizada", "+ Añadir gasto de estilo de vida", "+ Añadir elemento patrimonial", "Nombre del elemento", "Asignación de papá", "Asignación de mamá"
  ],
  fr: [
    "Félicitations ! Vous avez échappé à la course aux rats", "Suivi automatisé de la liberté financière", "Langue", "Devise", "Activer le thème sombre", "Revenu après impôt",
    "Télécharger le PDF", "Réinitialiser le formulaire", "Factures (50 %) :", "Mode de vie (30 %) :", "Patrimoine (20 %) :",
    "Dépenses essentielles", "Budget des factures (50 %) :", "Loyer / mensualité hypothécaire", "Frais de travail et de déplacement", "Autres dépenses essentielles", "Solde des factures C/D :",
    "Mode de vie (dépenses non essentielles)", "Budget du mode de vie (30 %) :", "Ajouter le solde des factures C/D :", "Budget alimentaire / repas au restaurant", "Divertissement et loisirs",
    "Solde du mode de vie B/D :", "Patrimoine (investissements et allocations)", "Budget du patrimoine (20 %) :", "Ajouter le solde du mode de vie B/D :",
    "Fonds d’urgence (6 mois)", "Compte d’investissement en fonds indiciels", "Remboursement des dettes (prêts, etc.)", "Solde restant du patrimoine :", "VOTRE NOMBRE DE LIBERTÉ FINANCIÈRE EST :",
    "Calcul : (revenu après impôt − solde restant du patrimoine) × 12 × 25", "+ Ajouter une facture", "+ Ajouter une dépense de mode de vie", "+ Ajouter un élément patrimonial", "Nom de l’élément", "Argent de poche de papa", "Argent de poche de maman"
  ],
  de: [
    "Glückwunsch! Du bist dem Hamsterrad entkommen", "Automatischer Finanzielle-Freiheit-Tracker", "Sprache", "Währung", "Dunkles Design umschalten", "Einkommen (nach Steuern)",
    "PDF herunterladen", "Formular zurücksetzen", "Rechnungen (50 %):", "Lebensstil (30 %):", "Vermögen (20 %):",
    "Notwendige Ausgaben", "Rechnungsbudget (50 %):", "Miete / Hypothekenzahlung", "Arbeits- und Fahrtkosten", "Weitere notwendige Rechnungen", "Rechnungssaldo C/D:",
    "Lebensstil (nicht notwendige Ausgaben)", "Lebensstilbudget (30 %):", "Zuzüglich Rechnungssaldo C/D:", "Lebensmittelbudget / auswärts essen", "Unterhaltung und Freizeit",
    "Lebensstilsaldo B/D:", "Vermögen (Anlagen und Rücklagen)", "Vermögensbudget (20 %):", "Zuzüglich Lebensstilsaldo B/D:",
    "Notfallfonds (6 Monate)", "Indexfonds-Anlagekonto", "Schulden tilgen (Kredite usw.)", "Verbleibender Vermögenssaldo:", "DEINE ZAHL FÜR FINANZIELLE FREIHEIT IST:",
    "Berechnung: (Einkommen nach Steuern − verbleibender Vermögenssaldo) × 12 × 25", "+ Rechnung hinzufügen", "+ Lebensstil-Ausgabe hinzufügen", "+ Vermögensposten hinzufügen", "Bezeichnung", "Taschengeld für Papa", "Taschengeld für Mama"
  ],
  zh: [
    "恭喜！您已摆脱困境", "自动财务自由追踪器", "语言", "货币", "切换深色主题", "税后收入",
    "下载 PDF", "重置表单", "账单（50%）：", "生活方式（30%）：", "财富（20%）：",
    "必要支出", "账单目标分配（50%）：", "房租 / 房贷", "工作和通勤费用", "其他必要账单", "账单结余 C/D：",
    "生活方式（非必要支出）", "生活方式目标分配（30%）：", "加上账单结余 C/D：", "餐饮预算 / 外出就餐", "娱乐与休闲",
    "生活方式结余 B/D：", "财富（投资与津贴）", "财富目标分配（20%）：", "加上生活方式结余 B/D：",
    "应急基金（6个月）", "指数基金投资账户", "偿还债务（贷款等）", "剩余财富结余：", "您的财务自由目标是：",
    "计算方式：（税后收入 − 剩余财富结余）× 12 × 25", "+ 添加自定义账单", "+ 添加生活方式支出", "+ 添加财富项目", "项目名称", "爸爸的津贴", "妈妈的津贴"
  ],
  hi: [
    "बधाई हो! आपने इस चक्र से बाहर निकलने का रास्ता बनाया", "स्वचालित वित्तीय स्वतंत्रता ट्रैकर", "भाषा", "मुद्रा", "डार्क थीम बदलें", "कर के बाद की आय",
    "PDF डाउनलोड करें", "फ़ॉर्म रीसेट करें", "बिल (50%):", "जीवनशैली (30%):", "संपत्ति (20%):",
    "ज़रूरी खर्च", "बिल के लिए लक्ष्य आवंटन (50%):", "किराया / गृह ऋण भुगतान", "काम और आने-जाने का खर्च", "अन्य ज़रूरी बिल", "बिल शेष C/D:",
    "जीवनशैली (गैर-ज़रूरी खर्च)", "जीवनशैली लक्ष्य आवंटन (30%):", "बिल शेष जोड़ें C/D:", "खाने का बजट / बाहर भोजन", "मनोरंजन और अवकाश",
    "जीवनशैली शेष B/D:", "संपत्ति (निवेश और भत्ते)", "संपत्ति लक्ष्य आवंटन (20%):", "जीवनशैली शेष जोड़ें B/D:",
    "आपातकालीन निधि (6 महीने)", "इंडेक्स फंड निवेश खाता", "कर्ज़ चुकाने का खाता (ऋण आदि)", "शेष संपत्ति:", "आपका वित्तीय स्वतंत्रता लक्ष्य है:",
    "गणना: (कर के बाद की आय − शेष संपत्ति) × 12 × 25", "+ कस्टम बिल जोड़ें", "+ जीवनशैली खर्च जोड़ें", "+ संपत्ति मद जोड़ें", "मद का नाम", "पापा का भत्ता", "मम्मी का भत्ता"
  ],
  ar: [
    "تهانينا! لقد تحررت من سباق الحياة", "متتبع آلي للحرية المالية", "اللغة", "العملة", "تبديل المظهر الداكن", "الدخل بعد الضريبة",
    "تنزيل PDF", "إعادة ضبط النموذج", "الفواتير (50٪):", "نمط الحياة (30٪):", "الثروة (20٪):",
    "النفقات الأساسية", "مخصص الفواتير (50٪):", "الإيجار / قسط الرهن العقاري", "نفقات العمل والتنقل", "فواتير أساسية أخرى", "رصيد الفواتير C/D:",
    "نمط الحياة (نفقات غير أساسية)", "مخصص نمط الحياة (30٪):", "إضافة رصيد الفواتير C/D:", "ميزانية الطعام / تناول الطعام بالخارج", "الترفيه والاستجمام",
    "رصيد نمط الحياة B/D:", "الثروة (الاستثمارات والمخصصات)", "مخصص الثروة (20٪):", "إضافة رصيد نمط الحياة B/D:",
    "صندوق الطوارئ (6 أشهر)", "حساب الاستثمار في صندوق المؤشرات", "سداد الديون (القروض وغيرها)", "رصيد الثروة المتبقي:", "رقم الحرية المالية الخاص بك هو:",
    "الحساب: (الدخل بعد الضريبة − رصيد الثروة المتبقي) × 12 × 25", "+ إضافة فاتورة مخصصة", "+ إضافة نفقة لنمط الحياة", "+ إضافة بند للثروة", "اسم البند", "مخصص الأب", "مخصص الأم"
  ],
  pt: [
    "Parabéns! Você escapou da corrida dos ratos", "Rastreador automático de liberdade financeira", "Idioma", "Moeda", "Alternar tema escuro", "Renda após impostos",
    "Baixar PDF", "Redefinir formulário", "Contas (50%):", "Estilo de vida (30%):", "Patrimônio (20%):",
    "Despesas essenciais", "Alocação para contas (50%):", "Aluguel / prestação da hipoteca", "Despesas de trabalho e deslocamento", "Outras contas essenciais", "Saldo das contas C/D:",
    "Estilo de vida (despesas não essenciais)", "Alocação para estilo de vida (30%):", "Adicionar saldo das contas C/D:", "Orçamento de alimentação / refeições fora", "Entretenimento e lazer",
    "Saldo do estilo de vida B/D:", "Patrimônio (investimentos e subsídios)", "Alocação para patrimônio (20%):", "Adicionar saldo do estilo de vida B/D:",
    "Fundo de emergência (6 meses)", "Conta de investimento em fundos de índice", "Quitar dívidas (empréstimos etc.)", "Saldo restante do patrimônio:", "SEU NÚMERO DE LIBERDADE FINANCEIRA É:",
    "Cálculo: (renda após impostos − saldo restante do patrimônio) × 12 × 25", "+ Adicionar conta personalizada", "+ Adicionar despesa de estilo de vida", "+ Adicionar item patrimonial", "Nome do item", "Mesada do papai", "Mesada da mamãe"
  ],
  ru: [
    "Поздравляем! Вы вырвались из замкнутого круга", "Автоматический трекер финансовой свободы", "Язык", "Валюта", "Переключить тёмную тему", "Доход после уплаты налогов",
    "Скачать PDF", "Сбросить форму", "Счета (50%):", "Образ жизни (30%):", "Капитал (20%):",
    "Обязательные расходы", "Распределение на счета (50%):", "Аренда / ипотечный платёж", "Расходы на работу и дорогу", "Другие обязательные счета", "Остаток по счетам C/D:",
    "Образ жизни (необязательные расходы)", "Распределение на образ жизни (30%):", "Плюс остаток по счетам C/D:", "Бюджет на еду / питание вне дома", "Развлечения и досуг",
    "Остаток на образ жизни B/D:", "Капитал (инвестиции и выплаты)", "Распределение на капитал (20%):", "Плюс остаток на образ жизни B/D:",
    "Резервный фонд (6 месяцев)", "Инвестиционный счёт индексного фонда", "Погашение долгов (кредиты и т. п.)", "Остаток капитала:", "ВАШЕ ЧИСЛО ФИНАНСОВОЙ СВОБОДЫ:",
    "Расчёт: (доход после налогов − остаток капитала) × 12 × 25", "+ Добавить свой счёт", "+ Добавить расход на образ жизни", "+ Добавить статью капитала", "Название статьи", "Папино пособие", "Мамино пособие"
  ],
  ja: [
    "おめでとうございます！ラットレースから抜け出しました", "自動資産形成トラッカー", "言語", "通貨", "ダークテーマを切り替え", "税引き後の収入",
    "PDFをダウンロード", "フォームをリセット", "請求・固定費（50%）：", "生活費（30%）：", "資産形成（20%）：",
    "必須支出", "固定費の目標配分（50%）：", "家賃 / 住宅ローン", "仕事・通勤費", "その他の必須支出", "固定費残高 C/D：",
    "生活費（必須ではない支出）", "生活費の目標配分（30%）：", "固定費残高を加算 C/D：", "食費予算 / 外食", "娯楽・レジャー",
    "生活費残高 B/D：", "資産形成（投資・手当）", "資産形成の目標配分（20%）：", "生活費残高を加算 B/D：",
    "緊急資金（6か月分）", "インデックスファンド投資口座", "借金返済（ローンなど）", "資産残高：", "あなたの経済的自立目標額：",
    "計算式：（税引き後の収入 − 資産残高）× 12 × 25", "+ 固定費を追加", "+ 生活費を追加", "+ 資産項目を追加", "項目名", "お父さんのお小遣い", "お母さんのお小遣い"
  ],
  xh: [
    "Sivuyisana nawe! Uphumile kumjikelo wamatyala", "Isixhobo sokulandelela inkululeko yezemali", "Ulwimi", "Imali", "Tshintsha umxholo omnyama", "Ingeniso emva kwerhafu",
    "Khuphela iPDF", "Seta ngokutsha ifomu", "Amatyala (50%):", "Indlela yokuphila (30%):", "Ubutyebi (20%):",
    "Iindleko eziyimfuneko", "Ulwabiwo lweendleko (50%):", "Irenti / intlawulo yemali-mboleko yendlu", "Iindleko zomsebenzi nezohambo", "Ezinye iindleko eziyimfuneko", "Ibhalansi yeendleko C/D:",
    "Indlela yokuphila (iindleko ezingeyomfuneko)", "Ulwabiwo lwendlela yokuphila (30%):", "Yongeza ibhalansi yeendleko C/D:", "Uhlahlo lokutya / ukutya ngaphandle", "Ukuzonwabisa nexesha lokuphumla",
    "Ibhalansi yendlela yokuphila B/D:", "Ubutyebi (utyalo-mali nezibonelelo)", "Ulwabiwo lobutyebi (20%):", "Yongeza ibhalansi yendlela yokuphila B/D:",
    "Ingxowa-mali yonxunguphalo (iinyanga ezi-6)", "Iakhawunti yotyalo-mali lwe-index fund", "Ukuhlawula amatyala (imali-mboleko, njl.)", "Ibhalansi yobutyebi eseleyo:", "INOMBOLO YAKHO YENKULULEKO YEZEMALI IYI:",
    "Ubalo: (ingeniso emva kwerhafu − ibhalansi yobutyebi eseleyo) × 12 × 25", "+ Yongeza ityala lakho", "+ Yongeza inkcitho yendlela yokuphila", "+ Yongeza into yobutyebi", "Igama lento", "Isibonelelo sikaTata", "Isibonelelo sikaMama"
  ],
  st: [
    "Re a u leboha! U phonyohile peisong ea bophelo", "Sesebelisoa sa ho sala morao tokoloho ea lichelete", "Puo", "Chelete", "Fetola tema e lefifi", "Moputso ka mor’a lekhetho",
    "Khoasolla PDF", "Seta foromo bocha", "Likoloto (50%):", "Mokhoa oa bophelo (30%):", "Leruo (20%):",
    "Litšenyehelo tsa bohlokoa", "Kabo ea likoloto (50%):", "Rente / tefo ea ntlo", "Litšenyehelo tsa mosebetsi le leeto", "Likoloto tse ling tsa bohlokoa", "Chelete e setseng ea likoloto C/D:",
    "Mokhoa oa bophelo (litšenyehelo tse sa hlokahaleng)", "Kabo ea mokhoa oa bophelo (30%):", "Eketsa chelete e setseng ea likoloto C/D:", "Tekanyetso ea lijo / ho jella kantle", "Boithabiso le phomolo",
    "Chelete e setseng ea mokhoa oa bophelo B/D:", "Leruo (matsete le meputso)", "Kabo ea leruo (20%):", "Eketsa chelete e setseng ea mokhoa oa bophelo B/D:",
    "Letlole la maemo a tšohanyetso (likhoeli tse 6)", "Ak'haonte ea matsete ea index fund", "Ho lefa likoloto (likalimo, jj.)", "Chelete e setseng ea leruo:", "NOMORO EA HAO EA TOKOLOHO EA LICHELETE KE:",
    "Palo: (moputso ka mor’a lekhetho − chelete e setseng ea leruo) × 12 × 25", "+ Kenya sekoloto sa tloaelo", "+ Kenya litšenyehelo tsa bophelo", "+ Kenya karolo ea leruo", "Lebitso la karolo", "Kabelo ea Ntate", "Kabelo ea 'Mè"
  ]
};

for (const [locale, rows] of Object.entries(localeRows)) {
  if (rows.length !== translationKeys.length) {
    throw new Error(`Translation matrix for ${locale} has ${rows.length} entries; expected ${translationKeys.length}.`);
  }
  translations[locale] = Object.fromEntries(translationKeys.map((key, index) => [key, rows[index]]));
}

Object.assign(translations["en-ZA"], { placeholderItem: "Item Name" });
Object.assign(translations["en-ZM"], { placeholderItem: "Item Name" });

function getTranslation(key, lang) {
  if (translations[lang] && translations[lang][key]) return translations[lang][key];
  return translations["en-ZA"][key] || key;
}

function formatMoney(amount, currencyCode, langCode) {
  try {
    return new Intl.NumberFormat(langCode, { style: 'currency', currency: currencyCode }).format(amount);
  } catch (e) {
    return currencyCode + ' ' + amount.toFixed(2);
  }
}
function calculateBudget() {
  const income = parseFloat(document.getElementById('income').value) || 0;
  const currency = document.getElementById('currencySelector').value;
  let lang = document.getElementById('langSelector').value;

  // Standardization guards to guarantee browser Intl engine formatting doesn't crash on raw ISO short-codes
  const mapping = { "fr": "fr-FR", "pt": "pt-PT", "zh": "zh-CN", "es": "es-ES", "de": "de-DE", "hi": "hi-IN", "ar": "ar-AE", "ru": "ru-RU", "ja": "ja-JP", "xh": "xh-ZA", "st": "st-ZA" };
  if (mapping[lang]) lang = mapping[lang];

  const targetBills = income * 0.50;
  const targetLifestyle = income * 0.30;
  const targetWealth = income * 0.20;

  document.getElementById('targetBills').innerText = formatMoney(targetBills, currency, lang);
  document.getElementById('targetLifestyle').innerText = formatMoney(targetLifestyle, currency, lang);
  document.getElementById('targetWealth').innerText = formatMoney(targetWealth, currency, lang);

  document.getElementById('overviewBills').innerText = formatMoney(targetBills, currency, lang);
  document.getElementById('overviewLifestyle').innerText = formatMoney(targetLifestyle, currency, lang);
  document.getElementById('overviewWealth').innerText = formatMoney(targetWealth, currency, lang);

  let totalBillsExpenses = 0;
  document.querySelectorAll('.expense-bills').forEach(input => { totalBillsExpenses += parseFloat(input.value) || 0; });
  const billsBalance = targetBills - totalBillsExpenses;
  document.getElementById('billsBalance').innerText = formatMoney(billsBalance, currency, lang);
  updateAlertColor('billsAlertBox', billsBalance);
  updateCategoryProgress('billsProgress', 'billsProgressFill', 'billsProgressPercent', 'billsProgressAmount', totalBillsExpenses, targetBills, currency, lang);

  document.getElementById('rolledBillsBalance').innerText = formatMoney(billsBalance, currency, lang);

  let totalLifestyleExpenses = 0;
  document.querySelectorAll('.expense-lifestyle').forEach(input => { totalLifestyleExpenses += parseFloat(input.value) || 0; });
  const lifestyleBalance = (targetLifestyle + billsBalance) - totalLifestyleExpenses;
  document.getElementById('lifestyleBalance').innerText = formatMoney(lifestyleBalance, currency, lang);
  updateAlertColor('lifestyleAlertBox', lifestyleBalance);
  updateCategoryProgress('lifestyleProgress', 'lifestyleProgressFill', 'lifestyleProgressPercent', 'lifestyleProgressAmount', totalLifestyleExpenses, targetLifestyle + billsBalance, currency, lang);

  document.getElementById('rolledLifestyleBalance').innerText = formatMoney(lifestyleBalance, currency, lang);

  let totalWealthExpenses = 0;
  document.querySelectorAll('.expense-wealth').forEach(input => { totalWealthExpenses += parseFloat(input.value) || 0; });
  const wealthBalance = (targetWealth + lifestyleBalance) - totalWealthExpenses;
  document.getElementById('wealthBalance').innerText = formatMoney(wealthBalance, currency, lang);
  updateAlertColor('wealthAlertBox', wealthBalance);
  updateCategoryProgress('wealthProgress', 'wealthProgressFill', 'wealthProgressPercent', 'wealthProgressAmount', totalWealthExpenses, targetWealth + lifestyleBalance, currency, lang);

  const financialFreedomNum = (income - wealthBalance) * 12 * 25;
  document.getElementById('financialFreedomNumber').innerText = formatMoney(financialFreedomNum, currency, lang);

  saveAllInputs();
  if (document.getElementById('reportDialog').open) {
    refreshFinancialFreedomReportSnapshot();
    updateReportProjections();
  }
}

function updateCategoryProgress(progressId, fillId, percentId, amountId, spent, allowance, currency, lang) {
  const progress = document.getElementById(progressId);
  const fill = document.getElementById(fillId);
  const percentLabel = document.getElementById(percentId);
  const amountLabel = document.getElementById(amountId);
  if (!progress || !fill || !percentLabel || !amountLabel) return;

  const percentUsed = allowance > 0 ? (spent / allowance) * 100 : spent > 0 ? 100 : 0;
  const visiblePercent = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 }).format(percentUsed);
  const progressValue = Math.min(100, Math.max(0, percentUsed));
  const spentText = formatMoney(spent, currency, lang);
  const allowanceText = formatMoney(Math.max(0, allowance), currency, lang);

  fill.style.width = `${progressValue}%`;
  fill.classList.toggle('near-limit', percentUsed >= 80 && percentUsed < 100);
  fill.classList.toggle('over-limit', percentUsed >= 100);
  percentLabel.textContent = `${visiblePercent}%`;
  amountLabel.textContent = `${spentText} / ${allowanceText}`;
  progress.setAttribute('aria-valuenow', String(Math.round(progressValue)));
  progress.setAttribute('aria-valuetext', `${visiblePercent}%; ${spentText} / ${allowanceText}`);
}

function updateAlertColor(elementId, balanceValue) {
  const alertBox = document.getElementById(elementId);
  if (alertBox) {
    if (balanceValue < 0) {
      alertBox.className = 'alert balance-negative';
    } else {
      alertBox.className = 'alert balance-positive';
    }
  }
}

function setTheme(isDark) {
  document.body.classList.toggle('dark-theme', isDark);
  const button = document.getElementById('btnTheme');
  if (button) button.setAttribute('aria-pressed', String(isDark));
  localStorage.setItem('ratRaceTheme', isDark ? 'dark' : 'light');
}

function toggleTheme() {
  setTheme(!document.body.classList.contains('dark-theme'));
}

function loadThemePreference() {
  setTheme(localStorage.getItem('ratRaceTheme') === 'dark');
}

function changeLanguage() {
  const fullLangCode = document.getElementById('langSelector').value;
  const translation = translations[fullLangCode] || translations["en-ZA"];
  document.documentElement.lang = fullLangCode;
  document.documentElement.dir = fullLangCode === 'ar' ? 'rtl' : 'ltr';
  translationKeys.forEach(key => {
    const el = document.getElementById(key);
    if (el) el.textContent = translation[key] || translations["en-ZA"][key];
  });
  document.getElementById('btnReport').textContent = reportButtonLabels[fullLangCode] || reportButtonLabels["en-ZA"];
  updateMonthlyRecordLanguage(fullLangCode);
  updateCurrentDateTime();
  document.querySelectorAll('.dynamic-label').forEach(input => {
    input.placeholder = translation.placeholderItem || translations["en-ZA"].placeholderItem;
  });
  applyReportLanguage(fullLangCode);
  calculateBudget();
}

function updateMonthlyRecordLanguage(langCode) {
  const strings = monthlyRecordTranslations[langCode.split('-')[0]] || monthlyRecordTranslations.en;
  document.getElementById('monthlyRecordsHeading').textContent = strings.heading;
  document.getElementById('monthlyRecordsDescription').textContent = strings.description;
  document.getElementById('recordMonthLabel').textContent = strings.month;
  document.getElementById('btnSaveMonthlyRecord').textContent = strings.save;
  document.getElementById('btnBrowseMonthlyRecords').textContent = strings.browse;
  document.getElementById('recordsDialogTitle').textContent = strings.savedHeading;
  document.getElementById('recordsDialogDescription').textContent = strings.savedDescription;
  document.getElementById('savedRecordMonthLabel').textContent = strings.savedMonth;
  document.getElementById('btnLoadMonthlyRecord').textContent = strings.load;
  document.getElementById('btnExportMonthlyRecords').textContent = strings.export;
  document.getElementById('btnImportMonthlyRecords').textContent = strings.import;
  document.getElementById('btnCloseRecords').textContent = strings.close;
}

function updateCurrentDateTime() {
  const language = document.getElementById('langSelector').value;
  const now = new Date();
  let dateLocale = language;
  let timeLocale = language;
  try {
    new Intl.DateTimeFormat(dateLocale).format(now);
    new Intl.DateTimeFormat(timeLocale, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now);
  } catch (error) {
    dateLocale = 'en-ZA';
    timeLocale = 'en-ZA';
  }

  document.getElementById('dateTimeLabel').textContent = dateTimeLabels[language] || dateTimeLabels["en-ZA"];
  const dateElement = document.getElementById('currentDate');
  const timeElement = document.getElementById('currentTime');
  dateElement.textContent = new Intl.DateTimeFormat(dateLocale, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }).format(now);
  timeElement.textContent = new Intl.DateTimeFormat(timeLocale, {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(now);
  dateElement.dateTime = now.toISOString();
  timeElement.dateTime = now.toISOString();
}

function resetForm() {
  if (confirm("Are you sure you want to clear your entire budget form back to zero?")) {
    localStorage.removeItem('ratRaceBudgetDataV5');
    document.querySelectorAll('.dynamic-row').forEach(row => row.remove());
    document.querySelectorAll('.container input[type="number"]').forEach(input => input.value = 0);
    calculateBudget();
  }
}

function addNewRow(containerId, className, savedLabel = '', savedValue = 0) {
  const container = document.getElementById(containerId);
  const timestampId = 'custom_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

  const rowDiv = document.createElement('div');
  rowDiv.className = 'dynamic-row';
  rowDiv.id = 'row_' + timestampId;
  rowDiv.setAttribute('data-container', containerId);
  rowDiv.setAttribute('data-class', className);

  rowDiv.innerHTML = `
    <div style="flex: 1;">
      <input type="text" class="form-control dynamic-label" placeholder="Item Name" oninput="calculateBudget()">
    </div>
    <div style="flex: 1;">
      <input type="number" id="${timestampId}" class="form-control ${className}" oninput="calculateBudget()">
    </div>
    <div style="width: 40px; text-align: right;">
      <button class="btn btn-outline-danger" onclick="removeRow('row_${timestampId}')">×</button>
    </div>
  `;

  rowDiv.querySelector('.dynamic-label').value = String(savedLabel);
  rowDiv.querySelector('input[type="number"]').value = String(savedValue);
  container.appendChild(rowDiv);
  changeLanguage();
}

function removeRow(rowId) {
  const element = document.getElementById(rowId);
  if (element) {
    element.remove();
    calculateBudget();
  }
}

function saveAllInputs() {
  localStorage.setItem('ratRaceBudgetDataV5', JSON.stringify(getBudgetDataSnapshot()));
}

function getBudgetDataSnapshot() {
  const budgetData = {
    staticFields: {}, dynamicRows: [],
    settings: { lang: document.getElementById('langSelector').value, currency: document.getElementById('currencySelector').value }
  };
  document.querySelectorAll('.container input[type="number"]:not([id^="custom_"])').forEach(input => { budgetData.staticFields[input.id] = input.value; });
  document.querySelectorAll('.dynamic-row').forEach(row => {
    budgetData.dynamicRows.push({
      containerId: row.getAttribute('data-container'), className: row.getAttribute('data-class'),
      label: row.querySelector('.dynamic-label').value, value: row.querySelector('input[type="number"]').value
    });
  });
  return budgetData;
}

function loadBudgetData() {
  const savedData = localStorage.getItem('ratRaceBudgetDataV5');
  if (savedData) applyBudgetData(JSON.parse(savedData));
  calculateBudget();
}

function validateBudgetData(budgetData) {
  if (!budgetData || typeof budgetData !== 'object'
      || !budgetData.staticFields || typeof budgetData.staticFields !== 'object'
      || (budgetData.dynamicRows !== undefined && !Array.isArray(budgetData.dynamicRows))
      || (budgetData.settings !== undefined
        && (!budgetData.settings || typeof budgetData.settings !== 'object' || Array.isArray(budgetData.settings)))) {
    throw new Error('The saved budget data has an invalid format.');
  }
  const validCurrencies = [...document.getElementById('currencySelector').options].map(option => option.value);
  const validLanguages = [...document.getElementById('langSelector').options].map(option => option.value);
  if (budgetData.settings
      && ((!validCurrencies.includes(budgetData.settings.currency)) || (!validLanguages.includes(budgetData.settings.lang)))) {
    throw new Error('The saved budget has an unsupported language or currency.');
  }
  for (const [id, value] of Object.entries(budgetData.staticFields)) {
    const field = document.getElementById(id);
    if (!field || field.type !== 'number' || !Number.isFinite(Number(value))) {
      throw new Error('The saved budget contains an invalid amount field.');
    }
  }
  for (const row of budgetData.dynamicRows || []) {
    const validContainer = ['bills-dynamic-container', 'lifestyle-dynamic-container', 'wealth-dynamic-container'].includes(row.containerId);
    const validClass = ['expense-bills', 'expense-lifestyle', 'expense-wealth'].includes(row.className);
    if (!validContainer || !validClass || typeof row.label !== 'string' || !Number.isFinite(Number(row.value))) {
      throw new Error('The saved budget contains an invalid custom row.');
    }
  }
}

function applyBudgetData(budgetData) {
  validateBudgetData(budgetData);
  document.querySelectorAll('.dynamic-row').forEach(row => row.remove());
  if (budgetData.settings) {
    document.getElementById('langSelector').value = budgetData.settings.lang;
    document.getElementById('currencySelector').value = budgetData.settings.currency;
  }
  Object.entries(budgetData.staticFields).forEach(([id, value]) => {
    document.getElementById(id).value = String(value);
  });
  (budgetData.dynamicRows || []).forEach(row => {
    addNewRow(row.containerId, row.className, row.label, row.value);
  });
  changeLanguage();
  calculateBudget();
}

function getLocalMonthKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

const MONTHLY_RECORDS_KEY = 'ratRaceMonthlyRecordsV1';

function readMonthlyRecords() {
  const savedRecords = localStorage.getItem(MONTHLY_RECORDS_KEY);
  if (!savedRecords) return { format: 'rat-race-monthly-records', version: 1, records: {} };

  const archive = JSON.parse(savedRecords);
  validateMonthlyRecordArchive(archive);
  return archive;
}

function validateMonthlyRecordArchive(archive) {
  if (!archive || archive.format !== 'rat-race-monthly-records'
      || archive.version !== 1 || !archive.records || typeof archive.records !== 'object'
      || Array.isArray(archive.records)) {
    throw new Error('The monthly-record archive is not valid.');
  }
  for (const [month, record] of Object.entries(archive.records)) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || !record || typeof record !== 'object') {
      throw new Error('The monthly-record archive contains an invalid month.');
    }
    validateBudgetData(record.budgetData);
    const validCurrencies = [...document.getElementById('currencySelector').options].map(option => option.value);
    const validLanguages = [...document.getElementById('langSelector').options].map(option => option.value);
    if (typeof record.savedAt !== 'string' || !Number.isFinite(Date.parse(record.savedAt))
        || !record.summary || !Number.isFinite(Number(record.summary.income))
        || !Number.isFinite(Number(record.summary.financialFreedomNumber))
        || !validCurrencies.includes(record.summary.currency)
        || !validLanguages.includes(record.summary.lang)) {
      throw new Error('A monthly record is missing valid summary information.');
    }
  }
}

function setMonthlyRecordStatus(message, isError = false, targetId = 'monthlyRecordStatus') {
  const status = document.getElementById(targetId);
  status.textContent = message;
  status.classList.toggle('report-error', isError);
}

function saveMonthlyRecord() {
  const month = document.getElementById('recordMonth').value;
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    setMonthlyRecordStatus('Choose a valid month before saving.', true);
    return;
  }

  let archive;
  try {
    archive = readMonthlyRecords();
  } catch (error) {
    setMonthlyRecordStatus(`Could not read saved records: ${error.message}`, true);
    return;
  }
  if (archive.records[month] && !confirm(`A record for ${month} already exists. Replace it with the current budget?`)) return;

  const snapshot = getFinancialFreedomSnapshot();
  archive.records[month] = {
    savedAt: new Date().toISOString(),
    budgetData: getBudgetDataSnapshot(),
    summary: {
      income: snapshot.income,
      financialFreedomNumber: snapshot.financialFreedomNumber,
      currency: snapshot.currency,
      lang: snapshot.lang
    }
  };
  try {
    localStorage.setItem(MONTHLY_RECORDS_KEY, JSON.stringify(archive));
  } catch (error) {
    setMonthlyRecordStatus(`Could not save this record in browser storage: ${error.message}`, true);
    return;
  }
  setMonthlyRecordStatus(`Saved budget for ${month} on this device.`);
}

function openMonthlyRecords() {
  const dialog = document.getElementById('recordsDialog');
  try {
    refreshMonthlyRecordList();
    setMonthlyRecordStatus('', false, 'recordsDialogStatus');
    if (!dialog.open) dialog.showModal();
  } catch (error) {
    setMonthlyRecordStatus(`Could not open saved records: ${error.message}`, true);
  }
}

function closeMonthlyRecords() {
  const dialog = document.getElementById('recordsDialog');
  if (dialog.open) dialog.close();
}

function refreshMonthlyRecordList(selectedMonth = '') {
  const archive = readMonthlyRecords();
  const selector = document.getElementById('savedRecordMonth');
  const months = Object.keys(archive.records).sort().reverse();
  selector.replaceChildren();
  for (const month of months) {
    const option = document.createElement('option');
    option.value = month;
    option.textContent = new Intl.DateTimeFormat(document.getElementById('langSelector').value, {
      year: 'numeric', month: 'long'
    }).format(new Date(`${month}-01T12:00:00`));
    selector.appendChild(option);
  }
  if (months.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No saved monthly records';
    selector.appendChild(option);
    selector.disabled = true;
    document.getElementById('btnLoadMonthlyRecord').disabled = true;
    document.getElementById('btnExportMonthlyRecords').disabled = true;
    document.getElementById('savedRecordSummary').textContent = 'Save a monthly record first to see it here.';
    return;
  }

  selector.disabled = false;
  document.getElementById('btnLoadMonthlyRecord').disabled = false;
  document.getElementById('btnExportMonthlyRecords').disabled = false;
  selector.value = months.includes(selectedMonth) ? selectedMonth : months[0];
  updateSelectedRecordSummary();
}

function updateSelectedRecordSummary() {
  const month = document.getElementById('savedRecordMonth').value;
  if (!month) return;
  try {
    const archive = readMonthlyRecords();
    const record = archive.records[month];
    if (!record) throw new Error('The selected record could not be found.');
    const { currency, lang } = record.summary;
    const displayMonth = new Intl.DateTimeFormat(document.getElementById('langSelector').value, {
      year: 'numeric', month: 'long'
    }).format(new Date(`${month}-01T12:00:00`));
    const savedDate = new Intl.DateTimeFormat(document.getElementById('langSelector').value, {
      dateStyle: 'medium', timeStyle: 'short'
    }).format(new Date(record.savedAt));
    document.getElementById('savedRecordSummary').textContent =
      `${displayMonth} · ${savedDate} · Income: ${formatMoney(record.summary.income, currency, lang)} · Financial Freedom Number: ${formatMoney(record.summary.financialFreedomNumber, currency, lang)}`;
  } catch (error) {
    setMonthlyRecordStatus(`Could not display this record: ${error.message}`, true, 'recordsDialogStatus');
  }
}

function loadSelectedMonthlyRecord() {
  const month = document.getElementById('savedRecordMonth').value;
  if (!month || !confirm(`Load the ${month} budget? This replaces the values currently shown in the form.`)) return;

  try {
    const archive = readMonthlyRecords();
    const record = archive.records[month];
    if (!record) throw new Error('The selected record could not be found.');
    applyBudgetData(record.budgetData);
    setMonthlyRecordStatus(`Loaded budget for ${month}.`);
    closeMonthlyRecords();
  } catch (error) {
    setMonthlyRecordStatus(`Could not load this record: ${error.message}`, true, 'recordsDialogStatus');
  }
}

function exportMonthlyRecords() {
  try {
    const archive = readMonthlyRecords();
    if (Object.keys(archive.records).length === 0) {
      setMonthlyRecordStatus('There are no monthly records to export.', true, 'recordsDialogStatus');
      return;
    }
    const file = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rat-race-monthly-records-${getLocalMonthKey()}.json`;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMonthlyRecordStatus('Backup exported. Store the downloaded file somewhere safe.', false, 'recordsDialogStatus');
  } catch (error) {
    setMonthlyRecordStatus(`Could not export records: ${error.message}`, true, 'recordsDialogStatus');
  }
}

async function importMonthlyRecords(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];
  if (!file) return;

  try {
    const importedArchive = JSON.parse(await file.text());
    validateMonthlyRecordArchive(importedArchive);
    const currentArchive = readMonthlyRecords();
    const collision = Object.keys(importedArchive.records).some(month => currentArchive.records[month]);
    if (collision && !confirm('Some months already have records. Importing will replace matching months with the backup records. Continue?')) return;
    const mergedArchive = {
      format: 'rat-race-monthly-records',
      version: 1,
      records: { ...currentArchive.records, ...importedArchive.records }
    };
    localStorage.setItem(MONTHLY_RECORDS_KEY, JSON.stringify(mergedArchive));
    refreshMonthlyRecordList();
    setMonthlyRecordStatus('Backup imported successfully.', false, 'recordsDialogStatus');
  } catch (error) {
    setMonthlyRecordStatus(`Could not import backup: ${error.message}`, true, 'recordsDialogStatus');
  } finally {
    fileInput.value = '';
  }
}

let reportAssumptionsInitialized = false;
let reportTargetCustomized = false;
let reportContributionFrequency = 'monthly';

function getFinancialFreedomSnapshot() {
  const income = parseFloat(document.getElementById('income').value) || 0;
  const currency = document.getElementById('currencySelector').value;
  const lang = document.getElementById('langSelector').value;
  const billsExpenses = [...document.querySelectorAll('.expense-bills')]
    .reduce((total, input) => total + (parseFloat(input.value) || 0), 0);
  const lifestyleExpenses = [...document.querySelectorAll('.expense-lifestyle')]
    .reduce((total, input) => total + (parseFloat(input.value) || 0), 0);
  const wealthExpenses = [...document.querySelectorAll('.expense-wealth')]
    .reduce((total, input) => total + (parseFloat(input.value) || 0), 0);
  const billsBalance = income * 0.5 - billsExpenses;
  const lifestyleBalance = income * 0.3 + billsBalance - lifestyleExpenses;
  const wealthBalance = income * 0.2 + lifestyleBalance - wealthExpenses;
  const financialFreedomNumber = (income - wealthBalance) * 12 * 25;

  return {
    income, currency, lang, billsExpenses, lifestyleExpenses, wealthExpenses,
    wealthBalance, financialFreedomNumber
  };
}

function addReportMetric(container, label, value) {
  const metric = document.createElement('div');
  metric.className = 'report-metric';
  const labelElement = document.createElement('span');
  labelElement.textContent = label;
  const valueElement = document.createElement('strong');
  valueElement.textContent = value;
  metric.append(labelElement, valueElement);
  container.appendChild(metric);
}

function getReportLocaleStrings(langCode = document.getElementById('langSelector').value) {
  const language = langCode.split('-')[0];
  return reportLocaleStrings[language] || reportLocaleStrings.en;
}

function getReportNoticeStrings(langCode = document.getElementById('langSelector').value) {
  const language = langCode.split('-')[0];
  return reportNoticeTranslations[language] || reportNoticeTranslations.en;
}

function applyReportLanguage(langCode) {
  const strings = getReportLocaleStrings(langCode);
  const notices = getReportNoticeStrings(langCode);
  const labelAliases = {
    budgetHeading: 'budget',
    assumptionsHeading: 'assumptions',
    projectionTarget: 'target',
    monthlyContribution: 'contribution',
    projectionHeading: 'projection',
    yearTableHeading: 'yearHeading',
    fundsHeading: 'funds'
  };
  const frequency = document.getElementById('reportContributionFrequency').value;
  document.getElementById('reportTitle').textContent = strings.title;
  document.getElementById('btnCloseReport').textContent = strings.close;
  document.getElementById('btnCloseReport').setAttribute('aria-label', strings.close);
  document.getElementById('btnPrintReport').textContent = strings.print;
  document.getElementById('btnCloseReportFooter').textContent = strings.closeReport;
  document.getElementById('reportDisclaimer').textContent = notices.disclaimer;
  document.getElementById('reportFundsNote').textContent = notices.funds;
  document.querySelectorAll('[data-report-label]').forEach(element => {
    const key = labelAliases[element.getAttribute('data-report-label')] || element.getAttribute('data-report-label');
    if (strings[key]) element.textContent = strings[key];
  });
  document.querySelectorAll('[data-report-scenario]').forEach(element => {
    const key = element.getAttribute('data-report-scenario');
    if (strings[key]) element.textContent = strings[key];
  });
  document.getElementById('reportContributionLabel').textContent =
    frequency === 'weekly' ? strings.weeklyContribution : strings.contribution;
  document.getElementById('reportRequiredContributionHeading').textContent =
    frequency === 'weekly' ? strings.requiredContributionWeekly : strings.requiredContribution;
  document.getElementById('reportContributionTiming').textContent =
    frequency === 'weekly' ? strings.timingWeekly : strings.timingMonthly;
}

function openFinancialFreedomReport() {
  const dialog = document.getElementById('reportDialog');

  if (!reportAssumptionsInitialized) {
    const indexContribution = Math.max(0, parseFloat(document.getElementById('indexFund').value) || 0);
    document.getElementById('reportContributionAmount').value = String(indexContribution);
    reportAssumptionsInitialized = true;
  }

  document.getElementById('reportError').hidden = true;
  if (!dialog.open) dialog.showModal();
  applyReportLanguage(document.getElementById('langSelector').value);
  refreshFinancialFreedomReportSnapshot();
  updateReportProjections();
}

function refreshFinancialFreedomReportSnapshot() {
  const snapshot = getFinancialFreedomSnapshot();
  const summary = document.getElementById('reportBudgetSummary');
  const lang = snapshot.lang;
  const labels = getReportLocaleStrings(snapshot.lang);
  const notices = getReportNoticeStrings(snapshot.lang);

  if (!reportTargetCustomized) {
    document.getElementById('reportTarget').value = String(Math.max(0, snapshot.financialFreedomNumber));
  }
  document.getElementById('reportGeneratedAt').textContent =
    `${new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeStyle: 'short' }).format(new Date())}`;
  document.getElementById('reportCurrencyCode').textContent = snapshot.currency;
  document.getElementById('reportCurrencyIntro').textContent = labels.currencyIntro;
  document.getElementById('reportContributionTiming').textContent =
    document.getElementById('reportContributionFrequency').value === 'weekly'
      ? labels.timingWeekly
      : labels.timingMonthly;
  document.getElementById('reportFormulaDescription').textContent = notices.formula;
  summary.replaceChildren();
  const summaryLabels = reportSummaryLabels[lang.split('-')[0]] || reportSummaryLabels.en;
  addReportMetric(summary, summaryLabels[0], formatMoney(snapshot.income, snapshot.currency, lang));
  addReportMetric(summary, summaryLabels[1], formatMoney(snapshot.billsExpenses, snapshot.currency, lang));
  addReportMetric(summary, summaryLabels[2], formatMoney(snapshot.lifestyleExpenses, snapshot.currency, lang));
  addReportMetric(summary, summaryLabels[3], formatMoney(snapshot.wealthExpenses, snapshot.currency, lang));
  addReportMetric(summary, summaryLabels[4], formatMoney(snapshot.wealthBalance, snapshot.currency, lang));
  addReportMetric(summary, summaryLabels[5], formatMoney(snapshot.financialFreedomNumber, snapshot.currency, lang));
  document.getElementById('reportTargetNote').textContent =
    notices.target;
}

function closeFinancialFreedomReport() {
  const dialog = document.getElementById('reportDialog');
  if (dialog.open) dialog.close();
}

function printFinancialFreedomReport() {
  document.body.classList.add('printing-report');
  window.addEventListener('afterprint', () => document.body.classList.remove('printing-report'), { once: true });
  window.print();
}

function getReportInputs() {
  const form = document.getElementById('reportForm');
  const error = document.getElementById('reportError');
  if (!form.checkValidity()) {
    error.textContent = 'Check the assumptions: values must be within the ranges shown in the fields.';
    error.hidden = false;
    return null;
  }
  error.hidden = true;
  return {
    startingBalance: Number(document.getElementById('reportStartingBalance').value),
    target: Number(document.getElementById('reportTarget').value),
    contributionAmount: Number(document.getElementById('reportContributionAmount').value),
    contributionFrequency: document.getElementById('reportContributionFrequency').value,
    annualFee: Number(document.getElementById('reportAnnualFee').value),
    inflation: Number(document.getElementById('reportInflation').value),
    years: Number(document.getElementById('reportYears').value),
    headlineScenario: document.getElementById('reportHeadlineScenario').value,
    rates: [
      { key: 'conservative', name: 'Conservative', value: Number(document.getElementById('reportConservativeRate').value), color: '#0d6efd' },
      { key: 'middle', name: 'Middle', value: Number(document.getElementById('reportMiddleRate').value), color: '#198754' },
      { key: 'optimistic', name: 'Optimistic', value: Number(document.getElementById('reportOptimisticRate').value), color: '#dc3545' }
    ]
  };
}

function calculateRequiredPeriodicContribution(target, startingBalance, periodRate, periods) {
  const startingValue = startingBalance * Math.pow(1 + periodRate, periods);
  const remainingGoal = Math.max(0, target - startingValue);
  if (remainingGoal === 0) return 0;
  if (Math.abs(periodRate) < 1e-12) return remainingGoal / periods;
  const contributionFactor = (Math.pow(1 + periodRate, periods) - 1) / periodRate;
  return contributionFactor > 0 ? remainingGoal / contributionFactor : Infinity;
}

function getContributionPeriodsPerYear(frequency) {
  return frequency === 'weekly' ? 52 : 12;
}

function changeReportContributionFrequency() {
  const select = document.getElementById('reportContributionFrequency');
  const newFrequency = select.value;
  const oldPeriodsPerYear = getContributionPeriodsPerYear(reportContributionFrequency);
  const newPeriodsPerYear = getContributionPeriodsPerYear(newFrequency);
  const contributionInput = document.getElementById('reportContributionAmount');
  const currentContribution = Number(contributionInput.value) || 0;
  contributionInput.value = String(currentContribution * oldPeriodsPerYear / newPeriodsPerYear);
  reportContributionFrequency = newFrequency;
  applyReportLanguage(document.getElementById('langSelector').value);
  updateReportProjections();
}

function projectInvestmentScenario(startingBalance, contribution, annualNetRate, goal, years, periodsPerYear) {
  const periodRate = Math.pow(1 + annualNetRate, 1 / periodsPerYear) - 1;
  const values = [startingBalance];
  const periods = years * periodsPerYear;
  let balance = startingBalance;
  let periodsToGoal = balance >= goal ? 0 : null;

  for (let period = 1; period <= 1200 * periodsPerYear && (period <= periods || periodsToGoal === null); period += 1) {
    balance = balance * (1 + periodRate) + contribution;
    if (periodsToGoal === null && balance >= goal) periodsToGoal = period;
    if (period % periodsPerYear === 0 && period <= periods) values.push(balance);
  }

  return { values, periodsToGoal, finalBalance: values[values.length - 1], periodRate };
}

function updateReportProjections() {
  const assumptions = getReportInputs();
  if (!assumptions) {
    document.getElementById('reportScenarioCards').replaceChildren();
    document.getElementById('reportScenarioTable').replaceChildren();
    document.getElementById('reportYearTable').replaceChildren();
    document.getElementById('reportChart').replaceChildren();
    document.getElementById('reportTimeToGoal').textContent = '';
    document.getElementById('reportTimeScenarioNote').textContent = '';
    return;
  }

  const snapshot = getFinancialFreedomSnapshot();
  const goal = assumptions.target;
  const lang = snapshot.lang;
  const { currency } = snapshot;
  const periodsPerYear = getContributionPeriodsPerYear(assumptions.contributionFrequency);
  const scenarios = assumptions.rates.map(scenario => {
    const annualNetRate = (scenario.value - assumptions.annualFee) / 100;
    const projection = projectInvestmentScenario(
      assumptions.startingBalance,
      assumptions.contributionAmount,
      annualNetRate,
      goal,
      assumptions.years,
      periodsPerYear
    );
    const requiredContribution = calculateRequiredPeriodicContribution(
      goal,
      assumptions.startingBalance,
      projection.periodRate,
      assumptions.years * periodsPerYear
    );
    return {
      ...scenario,
      name: getReportLocaleStrings(lang)[scenario.key],
      annualNetRate,
      projection,
      requiredContribution
    };
  });

  const headlineScenario = scenarios.find(scenario => scenario.key === assumptions.headlineScenario);
  const timeResult = document.getElementById('reportTimeToGoal');
  const timeTemplates = reportTimeTemplates[lang.split('-')[0]] || reportTimeTemplates.en;
  const noticeStrings = getReportNoticeStrings(lang);
  const timeAmount = formatMoney(goal, currency, lang);
  if (headlineScenario.projection.periodsToGoal === null) {
    timeResult.textContent = timeTemplates.unreachable.replace('{amount}', timeAmount);
  } else {
    const yearsToGoal = headlineScenario.projection.periodsToGoal / periodsPerYear;
    const formattedYears = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(yearsToGoal);
    timeResult.textContent = timeTemplates.reached
      .replace('{years}', formattedYears)
      .replace('{amount}', timeAmount);
  }
  const timeScenarioNote = document.getElementById('reportTimeScenarioNote');
  timeScenarioNote.textContent = noticeStrings.time
    .replace('{scenario}', headlineScenario.name.toLowerCase())
    .replace('{rate}', String(headlineScenario.value))
    .replace('{fee}', String(assumptions.annualFee));

  document.getElementById('reportProjectionMethod').textContent = noticeStrings.method
    .replace('{target}', formatMoney(goal, currency, lang))
    .replace('{fee}', String(assumptions.annualFee))
    .replace('{inflation}', String(assumptions.inflation));

  const cards = document.getElementById('reportScenarioCards');
  const table = document.getElementById('reportScenarioTable');
  cards.replaceChildren();
  table.replaceChildren();
  const scenarioTimeTemplates = reportTimeTemplates[lang.split('-')[0]] || reportTimeTemplates.en;
  for (const scenario of scenarios) {
    const projectedRealValue = scenario.projection.finalBalance / Math.pow(1 + assumptions.inflation / 100, assumptions.years);
    const scenarioYears = scenario.projection.periodsToGoal === null
      ? null
      : new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(scenario.projection.periodsToGoal / periodsPerYear);
    const scenarioTime = scenarioYears === null
      ? scenarioTimeTemplates.unreachable.replace('{amount}', timeAmount)
      : scenarioTimeTemplates.reached.replace('{years}', scenarioYears).replace('{amount}', timeAmount);
    const card = document.createElement('div');
    card.className = 'report-metric';
    const title = document.createElement('strong');
    title.textContent = `${scenario.name} (${scenario.value}% gross)`;
    const details = document.createElement('div');
    details.textContent = `${scenarioTime}. ${getReportLocaleStrings(lang).projectedValue}: ${formatMoney(scenario.projection.finalBalance, currency, lang)}.`;
    card.append(title, details);
    cards.appendChild(card);

    const row = document.createElement('tr');
    const cells = [
      scenario.name,
      `${scenario.value.toFixed(1)}%`,
      `${(scenario.annualNetRate * 100).toFixed(2)}%`,
      Number.isFinite(scenario.requiredContribution) ? formatMoney(scenario.requiredContribution, currency, lang) : '—',
      formatMoney(scenario.projection.finalBalance, currency, lang),
      formatMoney(projectedRealValue, currency, lang)
    ];
    for (const value of cells) {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  renderReportYearTable(scenarios, assumptions.years, lang, currency);
  renderReportChart(scenarios, assumptions.years, goal, lang, currency);
}

function renderReportYearTable(scenarios, years, lang, currency) {
  const table = document.getElementById('reportYearTable');
  table.replaceChildren();
  for (let year = 0; year <= years; year += 1) {
    const row = document.createElement('tr');
    const yearCell = document.createElement('th');
    yearCell.scope = 'row';
    yearCell.textContent = String(year);
    row.appendChild(yearCell);
    for (const scenario of scenarios) {
      const cell = document.createElement('td');
      cell.textContent = formatMoney(scenario.projection.values[year], currency, lang);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function renderReportChart(scenarios, years, goal, lang, currency) {
  const strings = getReportLocaleStrings(lang);
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('viewBox', '0 0 760 330');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', strings.projection);
  const plot = { left: 78, top: 24, width: 650, height: 236 };
  const maximum = Math.max(goal, ...scenarios.flatMap(item => item.projection.values), 1) * 1.05;
  const x = year => plot.left + (year / years) * plot.width;
  const y = value => plot.top + plot.height - (value / maximum) * plot.height;
  const addSvgElement = (tag, attributes, text) => {
    const element = document.createElementNS(namespace, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    if (text !== undefined) element.textContent = text;
    svg.appendChild(element);
    return element;
  };
  const compact = value => new Intl.NumberFormat(lang, { notation: 'compact', maximumFractionDigits: 1 }).format(value);

  for (let index = 0; index <= 4; index += 1) {
    const value = maximum * index / 4;
    const yPosition = y(value);
    addSvgElement('line', { x1: plot.left, y1: yPosition, x2: plot.left + plot.width, y2: yPosition, stroke: '#d8dee5', 'stroke-width': 1 });
    addSvgElement('text', { x: plot.left - 8, y: yPosition + 4, 'text-anchor': 'end', fill: '#526170', 'font-size': 11 }, `${currency} ${compact(value)}`);
  }
  addSvgElement('line', { x1: plot.left, y1: plot.top + plot.height, x2: plot.left + plot.width, y2: plot.top + plot.height, stroke: '#526170', 'stroke-width': 1.4 });
  for (const year of [...new Set([0, Math.round(years / 2), years])]) {
    const xPosition = x(year);
    addSvgElement('text', { x: xPosition, y: plot.top + plot.height + 20, 'text-anchor': 'middle', fill: '#526170', 'font-size': 12 }, `${strings.year} ${year}`);
  }
  if (goal > 0) {
    addSvgElement('line', { x1: plot.left, y1: y(goal), x2: plot.left + plot.width, y2: y(goal), stroke: '#6c757d', 'stroke-width': 1.5, 'stroke-dasharray': '7 5' });
    addSvgElement('text', { x: plot.left + 5, y: y(goal) - 6, fill: '#6c757d', 'font-size': 11 }, strings.target);
  }
  scenarios.forEach((scenario, scenarioIndex) => {
    const points = scenario.projection.values
      .map((value, year) => `${x(year)},${y(value)}`)
      .join(' ');
    addSvgElement('polyline', {
      points, fill: 'none', stroke: scenario.color, 'stroke-width': 3,
      'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    });
    const legendX = plot.left + scenarioIndex * 210;
    addSvgElement('line', { x1: legendX, y1: 310, x2: legendX + 24, y2: 310, stroke: scenario.color, 'stroke-width': 3 });
    addSvgElement('text', { x: legendX + 30, y: 314, fill: '#212529', 'font-size': 12 }, `${scenario.name} (${scenario.value}%)`);
  });
  document.getElementById('reportChart').replaceChildren(svg);
}
