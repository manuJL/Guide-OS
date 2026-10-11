import { Tutorial } from './types';

export const tutorials: Record<string, Tutorial> = {
  'send-photo': {
    id: 'send-photo',
    title: {
      en: 'Send a Photo on WhatsApp',
      hi: 'WhatsApp पर फोटो भेजें',
      te: 'WhatsApp లో ఫోటో పంపండి',
    },
    steps: [
      {
        id: 'sp-1',
        screen: 'home',
        targetElementId: 'app-whatsapp',
        instruction: {
          en: 'Open WhatsApp.',
          hi: 'WhatsApp खोलें।',
          te: 'WhatsApp తెరవండి.',
        },
        targetLabel: {
          en: 'The WhatsApp app icon on your home screen',
          hi: 'होम स्क्रीन पर WhatsApp ऐप आइकन',
          te: 'హోమ్ స్క్రీన్‌లోని WhatsApp యాప్ ఐకాన్',
        },
        whyThisStep: {
          en: 'WhatsApp is a messaging app. To send a photo, we first need to open it.',
          hi: 'WhatsApp एक मैसेजिंग ऐप है। फोटो भेजने के लिए, पहले इसे खोलना होगा।',
          te: 'WhatsApp ఒక మెసేజింగ్ యాప్. ఫోటో పంపడానికి, మొదట దీన్ని తెరవాలి.',
        },
      },
      {
        id: 'sp-2',
        screen: 'whatsapp-contacts',
        targetElementId: 'contact-alex',
        instruction: {
          en: 'Choose the person you want to send the photo to. Tap on Alex.',
          hi: 'जिसे फोटो भेजना है उसे चुनें। Alex पर टैप करें।',
          te: 'ఫోటో పంపాలనుకునే వ్యక్తిని ఎంచుకోండి. Alex పై టాప్ చేయండి.',
        },
        targetLabel: {
          en: 'The contact named Alex',
          hi: 'Alex नाम का संपर्क',
          te: 'Alex అనే కాంటాక్ట్',
        },
        whyThisStep: {
          en: 'You need to select a contact to open a chat with them before sending a photo.',
          hi: 'फोटो भेजने से पहले, चैट खोलने के लिए एक संपर्क चुनना होगा।',
          te: 'ఫోటో పంపడానికి ముందు, వారితో చాట్ తెరవడానికి ఒక కాంటాక్ట్ ఎంచుకోవాలి.',
        },
      },
      {
        id: 'sp-3',
        screen: 'whatsapp-chat',
        targetElementId: 'btn-attach',
        instruction: {
          en: 'Tap the attachment icon (📎) to attach a file.',
          hi: 'फाइल अटैच करने के लिए अटैचमेंट आइकन (📎) पर टैप करें।',
          te: 'ఫైల్ అటాచ్ చేయడానికి అటాచ్‌మెంట్ ఐకాన్ (📎) టాప్ చేయండి.',
        },
        targetLabel: {
          en: 'The attachment (📎) button in the chat input bar',
          hi: 'चैट इनपुट बार में अटैचमेंट (📎) बटन',
          te: 'చాట్ ఇన్‌పుట్ బార్‌లోని అటాచ్‌మెంట్ (📎) బటన్',
        },
        whyThisStep: {
          en: 'The attachment icon lets you share different types of files like photos, documents, and more.',
          hi: 'अटैचमेंट आइकन से आप फोटो, दस्तावेज़ आदि जैसी विभिन्न फाइलें शेयर कर सकते हैं।',
          te: 'అటాచ్‌మెంట్ ఐకాన్ ద్వారా ఫోటోలు, డాక్యుమెంట్లు వంటి వివిధ రకాల ఫైళ్లను షేర్ చేయవచ్చు.',
        },
      },
      {
        id: 'sp-4',
        screen: 'whatsapp-attachment-menu',
        targetElementId: 'attach-gallery',
        instruction: {
          en: 'Choose "Gallery" to pick a photo from your gallery.',
          hi: 'गैलरी से फोटो चुनने के लिए "गैलरी" पर टैप करें।',
          te: 'మీ గ్యాలరీ నుండి ఫోటో ఎంచుకోవడానికి "గ్యాలరీ" టాప్ చేయండి.',
        },
        targetLabel: {
          en: 'The Gallery option in the attachment menu',
          hi: 'अटैचमेंट मेनू में गैलरी विकल्प',
          te: 'అటాచ్‌మెంట్ మెనూలోని గ్యాలరీ ఆప్షన్',
        },
        whyThisStep: {
          en: 'The Gallery option opens your photo library where you can browse and select images.',
          hi: 'गैलरी विकल्प आपकी फोटो लाइब्रेरी खोलता है जहां आप तस्वीरें ब्राउज़ और चुन सकते हैं।',
          te: 'గ్యాలరీ ఆప్షన్ మీ ఫోటో లైబ్రరీని తెరుస్తుంది, అక్కడ మీరు చిత్రాలను బ్రౌజ్ చేసి ఎంచుకోవచ్చు.',
        },
      },
      {
        id: 'sp-5',
        screen: 'gallery',
        targetElementId: 'gallery-photo-1',
        instruction: {
          en: 'Select the photo you want to share.',
          hi: 'जो फोटो शेयर करना है उसे चुनें।',
          te: 'మీరు షేర్ చేయాలనుకునే ఫోటోను ఎంచుకోండి.',
        },
        targetLabel: {
          en: 'Any photo in the gallery',
          hi: 'गैलरी में कोई भी फोटो',
          te: 'గ్యాలరీలో ఏదైనా ఫోటో',
        },
        whyThisStep: {
          en: 'Tap on any photo to select it. You can choose any photo from your gallery.',
          hi: 'किसी भी फोटो पर टैप करके उसे चुनें। आप गैलरी से कोई भी फोटो चुन सकते हैं।',
          te: 'ఏదైనా ఫోటోపై టాప్ చేసి దాన్ని ఎంచుకోండి. మీరు గ్యాలరీ నుండి ఏదైనా ఫోటో ఎంచుకోవచ్చు.',
        },
      },
      {
        id: 'sp-6',
        screen: 'photo-preview',
        targetElementId: 'btn-send-photo',
        instruction: {
          en: 'Tap the Send button to share your photo.',
          hi: 'फोटो शेयर करने के लिए भेजें बटन पर टैप करें।',
          te: 'మీ ఫోటోను షేర్ చేయడానికి పంపు బటన్ టాప్ చేయండి.',
        },
        targetLabel: {
          en: 'The Send (➤) button at the bottom of the screen',
          hi: 'स्क्रीन के नीचे भेजें (➤) बटन',
          te: 'స్క్రీన్ దిగువన ఉన్న పంపు (➤) బటన్',
        },
        whyThisStep: {
          en: 'The green send button will send the photo to your selected contact.',
          hi: 'हरे रंग का भेजें बटन आपके चुने हुए संपर्क को फोटो भेज देगा।',
          te: 'ఆకుపచ్చ పంపు బటన్ మీరు ఎంచుకున్న కాంటాక్ట్‌కు ఫోటో పంపుతుంది.',
        },
      },
      {
        id: 'sp-7',
        screen: 'message-sent',
        targetElementId: '',
        instruction: {
          en: '🎉 Great! You successfully sent a photo on WhatsApp!',
          hi: '🎉 शानदार! आपने सफलतापूर्वक WhatsApp पर फोटो भेज दिया!',
          te: '🎉 భలే! మీరు WhatsApp లో ఫోటో విజయవంతంగా పంపారు!',
        },
        targetLabel: {
          en: 'The task is complete',
          hi: 'कार्य पूरा हो गया',
          te: 'పని పూర్తయింది',
        },
        whyThisStep: {
          en: 'You have completed all the steps. The photo has been sent!',
          hi: 'आपने सभी चरण पूरे कर लिए। फोटो भेज दी गई है!',
          te: 'మీరు అన్ని దశలను పూర్తి చేశారు. ఫోటో పంపబడింది!',
        },
      },
    ],
  },

  'set-alarm': {
    id: 'set-alarm',
    title: {
      en: 'Set an Alarm',
      hi: 'अलार्म सेट करें',
      te: 'అలారం సెట్ చేయండి',
    },
    steps: [
      {
        id: 'sa-1',
        screen: 'home',
        targetElementId: 'app-clock',
        instruction: {
          en: 'Open the Clock app.',
          hi: 'घड़ी ऐप खोलें।',
          te: 'గడియారం యాప్ తెరవండి.',
        },
        targetLabel: {
          en: 'The Clock app icon on your home screen',
          hi: 'होम स्क्रीन पर घड़ी ऐप आइकन',
          te: 'హోమ్ స్క్రీన్‌లోని గడియారం యాప్ ఐకాన్',
        },
        whyThisStep: {
          en: 'The Clock app contains alarm, timer, and stopwatch features.',
          hi: 'घड़ी ऐप में अलार्म, टाइमर और स्टॉपवॉच सुविधाएं हैं।',
          te: 'గడియారం యాప్‌లో అలారం, టైమర్ మరియు స్టాప్‌వాచ్ ఫీచర్లు ఉన్నాయి.',
        },
      },
      {
        id: 'sa-2',
        screen: 'clock-main',
        targetElementId: 'tab-alarm',
        instruction: {
          en: 'Go to the Alarm tab.',
          hi: 'अलार्म टैब पर जाएं।',
          te: 'అలారం ట్యాబ్‌కు వెళ్ళండి.',
        },
        targetLabel: {
          en: 'The Alarm tab at the top of the Clock app',
          hi: 'घड़ी ऐप के ऊपर अलार्म टैब',
          te: 'గడియారం యాప్ పైన ఉన్న అలారం ట్యాబ్',
        },
        whyThisStep: {
          en: 'The Clock app has multiple tabs. Select the Alarm tab to manage alarms.',
          hi: 'घड़ी ऐप में कई टैब हैं। अलार्म प्रबंधित करने के लिए अलार्म टैब चुनें।',
          te: 'గడియారం యాప్‌లో అనేక ట్యాబ్‌లు ఉన్నాయి. అలారాలను నిర్వహించడానికి అలారం ట్యాబ్ ఎంచుకోండి.',
        },
      },
      {
        id: 'sa-3',
        screen: 'clock-alarm-list',
        targetElementId: 'btn-add-alarm',
        instruction: {
          en: 'Tap "Add Alarm" to create a new alarm.',
          hi: 'नया अलार्म बनाने के लिए "अलार्म जोड़ें" पर टैप करें।',
          te: 'కొత్త అలారం సృష్టించడానికి "అలారం జోడించు" టాప్ చేయండి.',
        },
        targetLabel: {
          en: 'The "+ Add Alarm" button at the bottom of the list',
          hi: 'सूची के नीचे "+ अलार्म जोड़ें" बटन',
          te: 'జాబితా దిగువన ఉన్న "+ అలారం జోడించు" బటన్',
        },
        whyThisStep: {
          en: 'This button lets you create a new alarm with your preferred time.',
          hi: 'इस बटन से आप अपनी पसंद के समय पर नया अलार्म बना सकते हैं।',
          te: 'ఈ బటన్ ద్వారా మీకు నచ్చిన సమయానికి కొత్త అలారం సృష్టించవచ్చు.',
        },
      },
      {
        id: 'sa-4',
        screen: 'clock-add-alarm',
        targetElementId: 'btn-save-alarm',
        instruction: {
          en: 'Set your desired time, then tap "Save".',
          hi: 'अपना मनचाहा समय सेट करें, फिर "सेव करें" पर टैप करें।',
          te: 'మీకు కావలసిన సమయాన్ని సెట్ చేసి, "సేవ్" టాప్ చేయండి.',
        },
        targetLabel: {
          en: 'The Save button at the bottom of the screen',
          hi: 'स्क्रीन के नीचे सेव करें बटन',
          te: 'స్క్రీన్ దిగువన ఉన్న సేవ్ బటన్',
        },
        whyThisStep: {
          en: 'Use the hour and minute buttons to set the time, then save to activate the alarm.',
          hi: 'समय सेट करने के लिए घंटा और मिनट बटन का उपयोग करें, फिर अलार्म सक्रिय करने के लिए सेव करें।',
          te: 'సమయాన్ని సెట్ చేయడానికి గంట మరియు నిమిషం బటన్లు వాడండి, తర్వాత అలారం యాక్టివేట్ చేయడానికి సేవ్ చేయండి.',
        },
      },
      {
        id: 'sa-5',
        screen: 'clock-alarm-saved',
        targetElementId: '',
        instruction: {
          en: '🎉 Your alarm has been set successfully!',
          hi: '🎉 आपका अलार्म सफलतापूर्वक सेट हो गया!',
          te: '🎉 మీ అలారం విజయవంతంగా సెట్ చేయబడింది!',
        },
        targetLabel: {
          en: 'The task is complete',
          hi: 'कार्य पूरा हो गया',
          te: 'పని పూర్తయింది',
        },
        whyThisStep: {
          en: 'The alarm is now active and will ring at your chosen time.',
          hi: 'अलार्म अब सक्रिय है और आपके चुने हुए समय पर बजेगा।',
          te: 'అలారం ఇప్పుడు యాక్టివ్‌గా ఉంది మరియు మీరు ఎంచుకున్న సమయానికి మోగుతుంది.',
        },
      },
    ],
  },

  'turn-on-wifi': {
    id: 'turn-on-wifi',
    title: {
      en: 'Turn on Wi-Fi',
      hi: 'Wi-Fi चालू करें',
      te: 'Wi-Fi ఆన్ చేయండి',
    },
    steps: [
      {
        id: 'wf-1',
        screen: 'home',
        targetElementId: 'app-settings',
        instruction: {
          en: 'Open the Settings app.',
          hi: 'सेटिंग्स ऐप खोलें।',
          te: 'సెట్టింగ్స్ యాప్ తెరవండి.',
        },
        targetLabel: {
          en: 'The Settings app icon on your home screen',
          hi: 'होम स्क्रीन पर सेटिंग्स ऐप आइकन',
          te: 'హోమ్ స్క్రీన్‌లోని సెట్టింగ్స్ యాప్ ఐకాన్',
        },
        whyThisStep: {
          en: 'Wi-Fi is controlled from the Settings app.',
          hi: 'Wi-Fi को सेटिंग्स ऐप से नियंत्रित किया जाता है।',
          te: 'Wi-Fi ని సెట్టింగ్స్ యాప్ నుండి నియంత్రిస్తారు.',
        },
      },
      {
        id: 'wf-2',
        screen: 'settings-main',
        targetElementId: 'setting-wifi',
        instruction: {
          en: 'Open Wi-Fi settings.',
          hi: 'Wi-Fi सेटिंग्स खोलें।',
          te: 'Wi-Fi సెట్టింగ్స్ తెరవండి.',
        },
        targetLabel: {
          en: 'The Wi-Fi option at the top of Settings',
          hi: 'सेटिंग्स के ऊपर Wi-Fi विकल्प',
          te: 'సెట్టింగ్స్ పైన ఉన్న Wi-Fi ఆప్షన్',
        },
        whyThisStep: {
          en: 'This is where you can turn Wi-Fi on or off.',
          hi: 'यहां आप Wi-Fi चालू या बंद कर सकते हैं।',
          te: 'ఇక్కడే మీరు Wi-Fi ని ఆన్ లేదా ఆఫ్ చేయవచ్చు.',
        },
      },
      {
        id: 'wf-3',
        screen: 'settings-wifi',
        targetElementId: 'setting-wifi-toggle',
        instruction: {
          en: 'Tap the Wi-Fi switch to turn it on.',
          hi: 'Wi-Fi चालू करने के लिए स्विच पर टैप करें।',
          te: 'Wi-Fi ఆన్ చేయడానికి స్విచ్ టాప్ చేయండి.',
        },
        targetLabel: {
          en: 'The Wi-Fi switch at the top of the screen',
          hi: 'स्क्रीन के ऊपर Wi-Fi स्विच',
          te: 'స్క్రీన్ పైన ఉన్న Wi-Fi స్విచ్',
        },
        whyThisStep: {
          en: 'The switch shows the current state. Tapping it flips Wi-Fi on.',
          hi: 'स्विच वर्तमान स्थिति दिखाता है। इसे टैप करने से Wi-Fi चालू हो जाता है।',
          te: 'స్విచ్ ప్రస్తుత స్థితిని చూపుతుంది. దానిని టాప్ చేస్తే Wi-Fi ఆన్ అవుతుంది.',
        },
      },
      {
        id: 'wf-4',
        screen: 'settings-wifi',
        targetElementId: '',
        instruction: {
          en: '🎉 Wi-Fi is now turned on!',
          hi: '🎉 Wi-Fi अब चालू हो गया है!',
          te: '🎉 Wi-Fi ఇప్పుడు ఆన్ చేయబడింది!',
        },
        targetLabel: {
          en: 'The task is complete',
          hi: 'कार्य पूरा हो गया',
          te: 'పని పూర్తయింది',
        },
        whyThisStep: {
          en: 'Wi-Fi is now enabled so you can connect to networks and access the internet.',
          hi: 'Wi-Fi अब सक्रिय है, जिससे आप नेटवर्क से जुड़कर इंटरनेट का उपयोग कर सकते हैं।',
          te: 'Wi-Fi ఇప్పుడు ఆన్ అయింది, కాబట్టి మీరు నెట్‌వర్క్‌లకు కనెక్ట్ అయ్యి ఇంటర్నెట్ ఉపయోగించవచ్చు.',
        },
      },
    ],
  },
};