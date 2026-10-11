import { Language } from './types';

export interface I18nStrings {
  // App chrome
  appName: string;
  tagline: string;
  languageLabel: string;
  
  // Language names
  english: string;
  hindi: string;
  telugu: string;
  
  // Chat
  inputPlaceholder: string;
  sendButton: string;
  listeningState: string;
  processingState: string;
  voiceError: string;
  voiceUnsupported: string;
  
  // Tutorial controls
  startTutorial: string;
  backButton: string;
  restartTutorial: string;
  exitTutorial: string;
  stepOf: string; // "Step {current} of {total}"
  whyThisStep: string;
  completionTitle: string;
  completionMessage: string;
  tryAnotherTask: string;
  completedLabel: string;
  
  // Speech / narration controls
  speakingNow: string;
  pausedNow: string;
  soundOn: string;
  mutedNow: string;
  speechUnavailable: string;
  autoNarrateOn: string;
  autoNarrateOff: string;
  replayButton: string;
  pauseButton: string;
  resumeButton: string;
  muteButton: string;
  unmuteButton: string;
  tapTargetLabel: string;
  
  // Wrong tap
  wrongTapMessage: string;
  
  // Suggested tasks
  suggestedTasks: string;
  sendPhotoChip: string;
  setAlarmChip: string;
  wifiChip: string;
  
  // Assistant messages
  welcomeMessage: string;
  taskRecognized: string;
  taskNotSupported: string;
  ambiguousRequest: string;
  availableTasks: string;
  
  // Phone simulation label
  simulatedPhone: string;
  simulationDisclaimer: string;
  demoOnlyToast: string;
  
  // Example requests
  exampleSendPhoto: string;
  exampleSetAlarm: string;
  exampleWifi: string;
  
  // Phone UI
  phoneStatusBar: string;
  phoneHomeButton: string;
  
  // WhatsApp screens
  whatsappTitle: string;
  whatsappChats: string;
  whatsappCalls: string;
  whatsappStatus: string;
  typeMessage: string;
  attachmentTitle: string;
  galleryOption: string;
  cameraOption: string;
  documentOption: string;
  locationOption: string;
  contactOption: string;
  selectPhoto: string;
  sendPhoto: string;
  photoSent: string;
  
  // Clock screens
  clockTitle: string;
  alarmTab: string;
  worldClockTab: string;
  timerTab: string;
  stopwatchTab: string;
  addAlarm: string;
  alarmTime: string;
  saveAlarm: string;
  cancelAlarm: string;
  alarmSaved: string;
  setHour: string;
  setMinute: string;
  amLabel: string;
  pmLabel: string;
  
  // Settings
  settingsTitle: string;
  wifiSetting: string;
  bluetoothSetting: string;
  displaySetting: string;
  soundSetting: string;
  wifiOn: string;
  wifiOff: string;
  wifiTurnedOn: string;
  
  // Home screen app names
  appWhatsApp: string;
  appPhotos: string;
  appCamera: string;
  appPhone: string;
  appMessages: string;
  appSettings: string;
  appClock: string;
}

const en: I18nStrings = {
  appName: 'GuideOS',
  tagline: 'Your phone. Your language. Your guide.',
  languageLabel: 'Language',
  english: 'English',
  hindi: 'हिन्दी',
  telugu: 'తెలుగు',
  inputPlaceholder: 'Ask me how to do something on your phone...',
  sendButton: 'Send',
  listeningState: 'Listening...',
  processingState: 'Processing...',
  voiceError: 'Could not recognize speech. Please try again or type your request.',
  voiceUnsupported: 'Voice input is not supported in your browser. Please type your request instead.',
  startTutorial: 'Start Guided Tutorial',
  backButton: 'Back',
  restartTutorial: 'Restart',
  exitTutorial: 'Exit Tutorial',
  stepOf: 'Step {current} of {total}',
  whyThisStep: 'Why this step?',
  completionTitle: '🎉 Great job!',
  completionMessage: 'You completed the task successfully!',
  tryAnotherTask: 'Try another task',
  completedLabel: 'Completed',
  speakingNow: 'Speaking now…',
  pausedNow: 'Speech paused',
  soundOn: 'Sound on',
  mutedNow: 'Sound muted',
  speechUnavailable: 'Spoken narration may not be available in this language on this device. Read the steps below instead.',
  autoNarrateOn: 'Auto voice: On',
  autoNarrateOff: 'Auto voice: Off',
  replayButton: 'Replay',
  pauseButton: 'Pause',
  resumeButton: 'Resume',
  muteButton: 'Mute',
  unmuteButton: 'Unmute',
  tapTargetLabel: 'Tap:',
  wrongTapMessage: 'Not quite! Look for the highlighted element and tap on it.',
  suggestedTasks: 'Try these tasks:',
  sendPhotoChip: 'Send a photo on WhatsApp',
  setAlarmChip: 'Set an alarm',
  wifiChip: 'Turn on Wi-Fi',
  welcomeMessage: 'Hello! I\'m GuideOS, your phone assistant. Tell me what you\'d like to learn, and I\'ll guide you step by step. You can type in English, Hindi, or Telugu!',
  taskRecognized: 'I can help you with that! Click "Start Guided Tutorial" to begin.',
  taskNotSupported: 'I don\'t support that task yet. Here are the tasks I can help with:',
  ambiguousRequest: 'I\'m not sure what you mean. Could you be more specific? For example:',
  availableTasks: 'Available tasks',
  simulatedPhone: '📱 Simulated Phone',
  simulationDisclaimer: 'This is a simulation for learning purposes. It does not control your real phone.',
  demoOnlyToast: 'This screen is just a preview. Tap an app like WhatsApp, Clock, or Settings to explore.',
  exampleSendPhoto: 'Show me how to send a photo on WhatsApp.',
  exampleSetAlarm: 'How do I set an alarm?',
  exampleWifi: 'Turn on Wi-Fi.',
  phoneStatusBar: '9:41',
  phoneHomeButton: 'Home',
  whatsappTitle: 'WhatsApp',
  whatsappChats: 'Chats',
  whatsappCalls: 'Calls',
  whatsappStatus: 'Status',
  typeMessage: 'Type a message',
  attachmentTitle: 'Share content',
  galleryOption: 'Gallery',
  cameraOption: 'Camera',
  documentOption: 'Document',
  locationOption: 'Location',
  contactOption: 'Contact',
  selectPhoto: 'Select a photo',
  sendPhoto: 'Send',
  photoSent: 'Photo sent ✓',
  clockTitle: 'Clock',
  alarmTab: 'Alarm',
  worldClockTab: 'World Clock',
  timerTab: 'Timer',
  stopwatchTab: 'Stopwatch',
  addAlarm: 'Add Alarm',
  alarmTime: 'Set Time',
  saveAlarm: 'Save',
  cancelAlarm: 'Cancel',
  alarmSaved: 'Alarm saved!',
  setHour: 'Hour',
  setMinute: 'Minute',
  amLabel: 'AM',
  pmLabel: 'PM',
  settingsTitle: 'Settings',
  wifiSetting: 'Wi-Fi',
  bluetoothSetting: 'Bluetooth',
  displaySetting: 'Display',
  soundSetting: 'Sound',
  wifiOn: 'On',
  wifiOff: 'Off',
  wifiTurnedOn: 'Wi-Fi has been turned on!',
  appWhatsApp: 'WhatsApp',
  appPhotos: 'Photos',
  appCamera: 'Camera',
  appPhone: 'Phone',
  appMessages: 'Messages',
  appSettings: 'Settings',
  appClock: 'Clock',
};

const hi: I18nStrings = {
  appName: 'GuideOS',
  tagline: 'आपका फोन। आपकी भाषा। आपका गाइड।',
  languageLabel: 'भाषा',
  english: 'English',
  hindi: 'हिन्दी',
  telugu: 'తెలుగు',
  inputPlaceholder: 'मुझसे पूछें कि फोन पर कुछ कैसे करें...',
  sendButton: 'भेजें',
  listeningState: 'सुन रहा हूँ...',
  processingState: 'प्रोसेस हो रहा है...',
  voiceError: 'बोली पहचान नहीं पाया। कृपया फिर से कोशिश करें या टाइप करें।',
  voiceUnsupported: 'आपके ब्राउज़र में वॉइस इनपुट सपोर्ट नहीं है। कृपया टाइप करें।',
  startTutorial: 'गाइडेड ट्यूटोरियल शुरू करें',
  backButton: 'वापस',
  restartTutorial: 'फिर से शुरू करें',
  exitTutorial: 'ट्यूटोरियल बंद करें',
  stepOf: 'चरण {current} / {total}',
  whyThisStep: 'यह चरण क्यों?',
  completionTitle: '🎉 शाबाश!',
  completionMessage: 'आपने काम सफलतापूर्वक पूरा कर लिया!',
  tryAnotherTask: 'एक और काम करें',
  completedLabel: 'पूर्ण',
  speakingNow: 'अभी बोल रहा हूँ...',
  pausedNow: 'बोली रोकी गई',
  soundOn: 'आवाज़ चालू',
  mutedNow: 'आवाज़ म्यूट',
  speechUnavailable: 'इस डिवाइस पर इस भाषा में बोली जाने वाली आवाज़ उपलब्ध नहीं हो सकती। नीचे दिए चरण पढ़ें।',
  autoNarrateOn: 'ऑटो आवाज़: चालू',
  autoNarrateOff: 'ऑटो आवाज़: बंद',
  replayButton: 'फिर सुनें',
  pauseButton: 'रोकें',
  resumeButton: 'फिर से शुरू',
  muteButton: 'म्यूट',
  unmuteButton: 'अनम्यूट',
  tapTargetLabel: 'टैप करें:',
  wrongTapMessage: 'सही नहीं! हाइलाइट किए गए बटन को देखें और उस पर टैप करें।',
  suggestedTasks: 'ये काम करके देखें:',
  sendPhotoChip: 'WhatsApp पर फोटो भेजें',
  setAlarmChip: 'अलार्म सेट करें',
  wifiChip: 'Wi-Fi चालू करें',
  welcomeMessage: 'नमस्ते! मैं GuideOS हूँ, आपका फोन सहायक। बताइए आप क्या सीखना चाहते हैं, मैं कदम-दर-कदम आपकी मदद करूँगा। आप हिन्दी, English या తెలుగు में टाइप कर सकते हैं!',
  taskRecognized: 'मैं इसमें आपकी मदद कर सकता हूँ! "गाइडेड ट्यूटोरियल शुरू करें" पर क्लिक करें।',
  taskNotSupported: 'यह काम अभी सपोर्ट नहीं है। ये काम उपलब्ध हैं:',
  ambiguousRequest: 'मुझे समझ नहीं आया। कृपया और स्पष्ट बताएं। उदाहरण:',
  availableTasks: 'उपलब्ध काम',
  simulatedPhone: '📱 सिम्युलेटेड फोन',
  simulationDisclaimer: 'यह सीखने के लिए एक सिमुलेशन है। यह आपके असली फोन को नियंत्रित नहीं करता।',
  demoOnlyToast: 'यह स्क्रीन सिर्फ एक प्रीव्यू है। WhatsApp, घड़ी या सेटिंग्स जैसे ऐप खोलकर देखें।',
  exampleSendPhoto: 'मुझे WhatsApp पर फोटो भेजना सिखाओ।',
  exampleSetAlarm: 'अलार्म कैसे सेट करें?',
  exampleWifi: 'Wi-Fi चालू करो।',
  phoneStatusBar: '9:41',
  phoneHomeButton: 'होम',
  whatsappTitle: 'WhatsApp',
  whatsappChats: 'चैट',
  whatsappCalls: 'कॉल',
  whatsappStatus: 'स्टेटस',
  typeMessage: 'मैसेज टाइप करें',
  attachmentTitle: 'साझा करें',
  galleryOption: 'गैलरी',
  cameraOption: 'कैमरा',
  documentOption: 'दस्तावेज़',
  locationOption: 'लोकेशन',
  contactOption: 'संपर्क',
  selectPhoto: 'फोटो चुनें',
  sendPhoto: 'भेजें',
  photoSent: 'फोटो भेजा गया ✓',
  clockTitle: 'घड़ी',
  alarmTab: 'अलार्म',
  worldClockTab: 'विश्व घड़ी',
  timerTab: 'टाइमर',
  stopwatchTab: 'स्टॉपवॉच',
  addAlarm: 'अलार्म जोड़ें',
  alarmTime: 'समय सेट करें',
  saveAlarm: 'सेव करें',
  cancelAlarm: 'रद्द करें',
  alarmSaved: 'अलार्म सेव हो गया!',
  setHour: 'घंटा',
  setMinute: 'मिनट',
  amLabel: 'AM',
  pmLabel: 'PM',
  settingsTitle: 'सेटिंग्स',
  wifiSetting: 'Wi-Fi',
  bluetoothSetting: 'ब्लूटूथ',
  displaySetting: 'डिस्प्ले',
  soundSetting: 'ध्वनि',
  wifiOn: 'चालू',
  wifiOff: 'बंद',
  wifiTurnedOn: 'Wi-Fi चालू हो गया!',
  appWhatsApp: 'WhatsApp',
  appPhotos: 'फ़ोटो',
  appCamera: 'कैमरा',
  appPhone: 'फ़ोन',
  appMessages: 'मैसेज',
  appSettings: 'सेटिंग्स',
  appClock: 'घड़ी',
};

const te: I18nStrings = {
  appName: 'GuideOS',
  tagline: 'మీ ఫోన్. మీ భాష. మీ గైడ్.',
  languageLabel: 'భాష',
  english: 'English',
  hindi: 'हिन्दी',
  telugu: 'తెలుగు',
  inputPlaceholder: 'ఫోన్‌లో ఏదైనా ఎలా చేయాలో అడగండి...',
  sendButton: 'పంపు',
  listeningState: 'వింటున్నాను...',
  processingState: 'ప్రాసెస్ అవుతోంది...',
  voiceError: 'మాటను గుర్తించలేకపోయాను. దయచేసి మళ్ళీ ప్రయత్నించండి లేదా టైప్ చేయండి.',
  voiceUnsupported: 'మీ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి.',
  startTutorial: 'గైడెడ్ ట్యుటోరియల్ ప్రారంభించండి',
  backButton: 'వెనుకకు',
  restartTutorial: 'మళ్ళీ ప్రారంభించు',
  exitTutorial: 'ట్యుటోరియల్ ముగించు',
  stepOf: 'దశ {current} / {total}',
  whyThisStep: 'ఈ దశ ఎందుకు?',
  completionTitle: '🎉 భలే!',
  completionMessage: 'మీరు పనిని విజయవంతంగా పూర్తి చేశారు!',
  tryAnotherTask: 'మరో పని ప్రయత్నించండి',
  completedLabel: 'పూర్తయింది',
  speakingNow: 'ఇప్పుడు మాట్లాడుతున్నాను...',
  pausedNow: 'మాట ఆపబడింది',
  soundOn: 'ధ్వని ఆన్',
  mutedNow: 'ధ్వని మ్యూట్',
  speechUnavailable: 'ఈ పరికరంలో ఈ భాషలో మాట్లాడే సౌకర్యం అందుబాటులో ఉండకపోవచ్చు. క్రింది దశలను చదవండి.',
  autoNarrateOn: 'ఆటో వాయిస్: ఆన్',
  autoNarrateOff: 'ఆటో వాయిస్: ఆఫ్',
  replayButton: 'మళ్ళీ వినండి',
  pauseButton: 'పాజ్',
  resumeButton: 'మళ్ళీ ప్రారంభించు',
  muteButton: 'మ్యూట్',
  unmuteButton: 'అన్‌మ్యూట్',
  tapTargetLabel: 'టాప్ చేయండి:',
  wrongTapMessage: 'సరిగ్గా కాదు! హైలైట్ చేసిన బటన్‌ను చూసి దానిపై టాప్ చేయండి.',
  suggestedTasks: 'ఈ పనులు ప్రయత్నించండి:',
  sendPhotoChip: 'WhatsApp లో ఫోటో పంపండి',
  setAlarmChip: 'అలారం సెట్ చేయండి',
  wifiChip: 'Wi-Fi ఆన్ చేయండి',
  welcomeMessage: 'నమస్కారం! నేను GuideOS, మీ ఫోన్ సహాయకుడిని. మీరు ఏమి నేర్చుకోవాలనుకుంటున్నారో చెప్పండి, నేను అడుగు అడుగునా మీకు సహాయం చేస్తాను! మీరు తెలుగు, English లేదా हिन्दी లో టైప్ చేయవచ్చు!',
  taskRecognized: 'నేను ఇందులో మీకు సహాయం చేయగలను! "గైడెడ్ ట్యుటోరియల్ ప్రారంభించండి" పై క్లిక్ చేయండి.',
  taskNotSupported: 'ఈ పని ఇంకా అందుబాటులో లేదు. అందుబాటులో ఉన్న పనులు:',
  ambiguousRequest: 'నాకు అర్థం కాలేదు. దయచేసి మరింత స్పష్టంగా చెప్పండి. ఉదాహరణ:',
  availableTasks: 'అందుబాటులో ఉన్న పనులు',
  simulatedPhone: '📱 సిమ్యులేటెడ్ ఫోన్',
  simulationDisclaimer: 'ఇది నేర్చుకోవడానికి ఒక సిమ్యులేషన్. ఇది మీ నిజమైన ఫోన్‌ను నియంత్రించదు.',
  demoOnlyToast: 'ఈ స్క్రీన్ కేవలం ప్రివ్యూ మాత్రమే. WhatsApp, గడియారం లేదా సెట్టింగ్స్ వంటి యాప్ తెరవండి.',
  exampleSendPhoto: 'WhatsApp లో ఫోటో ఎలా పంపాలో చూపించు.',
  exampleSetAlarm: 'అలారం ఎలా సెట్ చేయాలి?',
  exampleWifi: 'Wi-Fi ఆన్ చేయి.',
  phoneStatusBar: '9:41',
  phoneHomeButton: 'హోమ్',
  whatsappTitle: 'WhatsApp',
  whatsappChats: 'చాట్‌లు',
  whatsappCalls: 'కాల్స్',
  whatsappStatus: 'స్టేటస్',
  typeMessage: 'మెసేజ్ టైప్ చేయండి',
  attachmentTitle: 'షేర్ చేయండి',
  galleryOption: 'గ్యాలరీ',
  cameraOption: 'కెమెరా',
  documentOption: 'డాక్యుమెంట్',
  locationOption: 'లొకేషన్',
  contactOption: 'కాంటాక్ట్',
  selectPhoto: 'ఫోటో ఎంచుకోండి',
  sendPhoto: 'పంపు',
  photoSent: 'ఫోటో పంపబడింది ✓',
  clockTitle: 'గడియారం',
  alarmTab: 'అలారం',
  worldClockTab: 'ప్రపంచ గడియారం',
  timerTab: 'టైమర్',
  stopwatchTab: 'స్టాప్‌వాచ్',
  addAlarm: 'అలారం జోడించు',
  alarmTime: 'సమయం సెట్ చేయండి',
  saveAlarm: 'సేవ్ చేయి',
  cancelAlarm: 'రద్దు',
  alarmSaved: 'అలారం సేవ్ అయింది!',
  setHour: 'గంట',
  setMinute: 'నిమిషం',
  amLabel: 'AM',
  pmLabel: 'PM',
  settingsTitle: 'సెట్టింగ్స్',
  wifiSetting: 'Wi-Fi',
  bluetoothSetting: 'బ్లూటూత్',
  displaySetting: 'డిస్‌ప్లే',
  soundSetting: 'సౌండ్',
  wifiOn: 'ఆన్',
  wifiOff: 'ఆఫ్',
  wifiTurnedOn: 'Wi-Fi ఆన్ చేయబడింది!',
  appWhatsApp: 'WhatsApp',
  appPhotos: 'ఫోటోలు',
  appCamera: 'కెమెరా',
  appPhone: 'ఫోన్',
  appMessages: 'మెసేజ్‌లు',
  appSettings: 'సెట్టింగ్స్',
  appClock: 'గడియారం',
};

const translations: Record<Language, I18nStrings> = { en, hi, te };

export function t(lang: Language): I18nStrings {
  return translations[lang];
}

export function formatStep(template: string, current: number, total: number): string {
  return template.replace('{current}', String(current)).replace('{total}', String(total));
}
