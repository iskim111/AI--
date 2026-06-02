const EDUCATION_DATA = {
  tabs: [
    {
      id: 'environment',
      label: '실습 준비',
      title: '실습 준비',
      description: '',
      sections: [
        {
          type: 'app-links',
          title: '실습자료 다운로드',
          icon: 'download',
          items: [
            {
              brand: 'python',
              name: 'Python',
              description: '데이터 분석과 자동화 실습에 사용하는 프로그래밍 언어입니다. 설치 시 Add python.exe to PATH를 체크하세요.',
              url: 'https://www.python.org/ftp/python/3.14.5/python-3.14.5-amd64.exe',
              urlLabel: 'Python 3.14.5 다운로드'
            },
            {
              brand: 'vscode',
              name: 'Visual Studio Code',
              description: 'Python 코드 작성, 터미널 실행, 확장 프로그램 설치에 사용하는 코드 편집기입니다.',
              url: 'https://update.code.visualstudio.com/latest/win32-x64-user/stable',
              urlLabel: 'VS Code 다운로드 (x64)'
            }
          ]
        },
        {
          type: 'app-links',
          title: '생성형 AI 종류',
          icon: 'smart_toy',
          summary: '대화창에서 질문·답변·글쓰기·요약',
          summaryVariant: 'generative',
          items: [
            {
              brand: 'chatgpt',
              name: 'ChatGPT (OpenAI)',
              description: '일반 질문, 문서 요약, 코드 초안, 아이디어 정리',
              url: 'https://chatgpt.com',
              urlLabel: '바로가기'
            },
            {
              brand: 'gemini',
              name: 'Gemini (Google)',
              description: '웹 검색 연동, 파일·이미지 분석, Google 서비스 연계',
              url: 'https://gemini.google.com',
              urlLabel: '바로가기'
            },
            {
              brand: 'claude',
              name: 'Claude (Anthropic)',
              description: '긴 문서 분석, 논리적 추론, 코드·보고서 초안 작성',
              url: 'https://claude.ai',
              urlLabel: '바로가기'
            },
            {
              brand: 'genspark',
              name: 'Genspark (MainFunc)',
              description: '올인원 AI 워크스페이스 — 검색·슬라이드·시트·코딩·자료 조사를 한곳에서',
              url: 'https://www.genspark.ai/',
              urlLabel: '바로가기'
            }
          ]
        },
        {
          type: 'app-links',
          title: 'Agent AI 종류',
          icon: 'support_agent',
          summary: '지시하면 코드·파일·검색을 직접 실행해 단계별 처리',
          summaryVariant: 'agent',
          items: [
            {
              brand: 'codex',
              name: 'Codex (OpenAI)',
              description: 'OpenAI 코딩 에이전트 — 터미널·클라우드에서 과제를 맡기면 저장소 분석·코드 수정·실행',
              url: 'https://openai.com/codex/get-started/',
              urlLabel: 'Codex 시작하기'
            },
            {
              brand: 'claude',
              name: 'Claude Code (Anthropic)',
              description: '터미널·IDE 연동 — 프로젝트 파일을 읽고 명령·코드 변경을 자동 수행',
              url: 'https://claude.ai/api/desktop/win32/x64/msix/latest/redirect',
              urlLabel: 'Windows용 다운로드'
            },
            {
              brand: 'cursor',
              name: 'Cursor (Anysphere)',
              description: '프로젝트를 열면 Agent가 파일 편집·코드 작성·터미널 실행',
              url: 'https://downloads.cursor.com/production/81fcf2931d7687b4ff3f3017858d0c6dee7e2a68/win32/x64/user-setup/CursorUserSetup-x64-3.6.31.exe',
              urlLabel: 'Download for Windows'
            }
          ]
        },
        {
          type: 'app-links',
          title: 'IDE(Integrated Development Environment) 종류',
          titleHtml: 'IDE(<span class="term-pair">Integrated<sup class="term-ko">통합</sup></span> <span class="term-pair">Development<sup class="term-ko">개발</sup></span> <span class="term-pair">Environment<sup class="term-ko">환경</sup></span>) 종류',
          icon: 'code',
          summary: '코드 작성·실행·디버깅을 한 프로그램에서 하는 통합 개발 환경',
          summaryVariant: 'ide',
          items: [
            {
              brand: 'vscode',
              name: 'Visual Studio Code (Microsoft)',
              description: '가볍고 확장 가능한 편집기 — Python·웹 코드 작성·실행',
              url: 'https://update.code.visualstudio.com/latest/win32-x64-user/stable',
              urlLabel: 'VS Code 다운로드 (x64)'
            },
            {
              brand: 'antigravity',
              name: 'Antigravity (Google)',
              description: 'Agent가 편집기·터미널·브라우저에서 계획·실행·검증',
              url: 'https://antigravity.google/download',
              urlLabel: '공식 페이지에서 다운로드'
            }
          ]
        }
      ]
    },
    {
      id: 'vscode-setup',
      label: 'VS Code 설정',
      title: 'VS Code 설정',
      description: 'VS Code에서 Codex 와 Python 사용을 위해 기본 설정을 진행합니다.',
      sections: [
        {
          type: 'tip',
          title: '기본 설정',
          icon: 'settings',
          items: [
            'VS Code 좌측 메뉴에서 확장<img class="tip-inline-icon" src="assets/images/vscode-extensions-icon.png" alt="확장">을 선택하고 검색창에 Codex 검색해서 설치',
            '검색창에 Python 검색해서 설치'
          ]
        },
        {
          type: 'image',
          title: '1. Codex 설치',
          icon: 'extension',
          src: 'assets/images/vscode-codex-install.png',
          alt: 'VS Code 확장 마켓플레이스에서 codex 검색 후 Codex – OpenAI coding agent 설치',
          compact: true
        },
        {
          type: 'image',
          title: '2. Python 설치',
          icon: 'extension',
          src: 'assets/images/vscode-python-install.png',
          alt: 'VS Code 확장 마켓플레이스에서 python 검색 후 Python(Microsoft) 설치',
          compact: true
        },
        {
          type: 'image',
          title: '3. Codex(Chat GPT) 로그인',
          icon: 'login',
          compact: true,
          images: [
            {
              src: 'assets/images/vscode-codex-login.png',
              alt: 'VS Code Codex 패널에서 ChatGPT로 로그인'
            },
            {
              src: 'assets/images/chatgpt-google-login.png',
              alt: 'ChatGPT 로그인 화면에서 Google 계정으로 계속하기'
            },
            {
              src: 'assets/images/google-account-select.png',
              alt: 'Google 계정 선택 화면에서 OpenAI 로그인용 계정 선택'
            }
          ]
        }
      ]
    },
    {
      id: 'gemini',
      label: "\uc0dd\uc131\ud615 AI",
      topic: '',
      title: '',
      description: '',
      sections: [
        {
          type: 'prompts',
          title: '',
          prompts: [
            { label: "\uc0dd\uc131\ud615 AI \uae30\ubcf8 \uac1c\ub150", text: "\uc0dd\uc131\ud615 AI\uac00 \ubb34\uc5c7\uc774\uc57c?" },
            { label: "\uac15\uc758\uc790\ub8cc PDF \uc694\uc57d", text: "\ucca8\ubd80\ud55c \uac15\uc758\uc790\ub8cc PDF\uc758 \ub0b4\uc6a9\uc744 \uc815\ub9ac\ud574\uc918" },
            { label: "\ub178\ub798 \uc0dd\uc131", text: "\uc2e0\ub098\ub294 \ub178\ub798 \ub9cc\ub4e4\uc5b4\uc918" },
            { label: "\ucd5c\uc2e0 \uc815\ubcf4 \uc870\ud68c", text: "\uc624\ub298\uc758 \uc8fc\uc694 \uc774\uc288\ub97c \uc815\ub9ac\ud574\uc918" },
            { label: "\uc778\ud3ec\uadf8\ub798\ud53d \uc0dd\uc131", text: "\uc55e\uc758 \uc8fc\uc694 \uc774\uc288 \uc815\ubcf4\ub97c \ubcf4\uae30 \uc88b\uac8c \uc778\ud3ec\uadf8\ub798\ud53d\ucc98\ub7fc \uc815\ub9ac\ud574\uc918" }
          ]
        }
      ]
    },
    {
      id: 'prompt',
      label: "\ud504\ub86c\ud504\ud2b8 \uc5d4\uc9c0\ub2c8\uc5b4\ub9c1",
      topic: '',
      title: "\uc0dd\uc131\ud615 AI\ub97c \uc704\ud55c \ud504\ub86c\ud504\ud2b8 \uc5d4\uc9c0\ub2c8\uc5b4\ub9c1",
      description: "\ud504\ub86c\ud504\ud2b8 \uc791\uc131 \uc2a4\ud0ac\uc744 \uc775\ud788\uace0, \uc5c5\ubb34\ud615 \ud15c\ud50c\ub9bf\uc744 \ud65c\uc6a9\ud569\ub2c8\ub2e4.",
      sections: [
        {
          type: 'prompts',
          title: "\ud504\ub86c\ud504\ud2b8 \uc5d4\uc9c0\ub2c8\uc5b4\ub9c1 \uae30\ubcf8",
          icon: 'psychology',
          prompts: [
            { label: "\uc6f9\uac80\uc0c9 + \uc804\ubb38\uac00 \uad00\uc810", text: "\ucd5c\uc2e0 \uc815\ubcf4\ub97c \uac80\uc0c9\ud574\uc11c [[\uc804\ubb38\uac00 \uad00\uc810]]\uc5d0\uc11c \ud575\uc2ec\ub9cc \uc815\ub9ac\ud574\uc918" },
            { label: "\ubaa8\ub378\ubcc4 \ucc28\uc774 \ube44\uad50", text: "Gemini\uc640 ChatGPT\uc758 \ucc28\uc774\ub97c \ud45c\ub85c \uc815\ub9ac\ud574\uc918" },
            { label: "\uc608\uc2dc \uae30\ubc18 \uc694\uccad(Few-shot)", text: "\uc0ac\uacfc:\uacfc\uc77c\n\uace0\uc591\uc774:\ub3d9\ubb3c\n\uc7a5\ubbf8:" },
            { label: "\ub2e8\uacc4\uc801 \uc0ac\uace0 (CoT)", text: "\ub2e4\uc74c \ubb38\uc81c\ub97c \ub2e8\uacc4\uc801\uc73c\ub85c \uc0dd\uac01\ud558\uba70 \ud480\uc5b4\uc918.\n----\n\ub0b4 \ucc28\ub97c \uc138\ucc28\ub97c \ud558\ub7ec \uac00\uc57c\ud558\ub294\ub370, \uc138\ucc28\uc7a5\uae4c\uc9c0\uc758 \uac70\ub9ac\uac00 20M\uc57c. \ucc28\ub97c \uac00\uc9c0\uace0 \uac00\uc57c\ud560\uae4c, \uadf8\ub0e5 \uac78\uc5b4\uac00\ub294\uac8c \ub098\uc744\uae4c?\n\ub2f5\ub9cc \ub9d0\ud574" }
          ]
        },
        {
          type: 'prompts',
          title: "\uc5c5\ubb34\ud615 \ud504\ub86c\ud504\ud2b8 \ud15c\ud50c\ub9bf",
          icon: 'work',
          prompts: [
            { label: "\uace0\uac1d \uc548\ub0b4 \ubb38\uc790/\uc804\ud654 \uba58\ud2b8", text: "[\uc5ed\ud560] \ub2f9\uc2e0\uc740 \uace0\uac1d\uc9c0\uc6d0 \ub2f4\ub2f9\uc790\uc785\ub2c8\ub2e4.\n[\uc0c1\ud669]\n- \ubc29\ubb38 \uc77c\uc815\uc774 \uc9c0\uc5f0\ub418\uc5b4 \uace0\uac1d\uc774 \ubd88\ud3b8\uc744 \uacaa\uace0 \uc788\uc2b5\ub2c8\ub2e4.\n- \uc9c0\uc5f0 \uc0ac\uc720\ub294 \uc774\uc804 \ud604\uc7a5 \uc791\uc5c5 \uc9c0\uc5f0\uc785\ub2c8\ub2e4.\n- \uc0c8 \ubc29\ubb38 \uc608\uc815 \uc2dc\uac04\uc740 \uc624\ub298 16\uc2dc 30\ubd84\uc785\ub2c8\ub2e4.\n[\uc694\uccad] \uace0\uac1d\uc5d0\uac8c \ubcf4\ub0bc \ubb38\uc790\uc640 \uc804\ud654 \uc548\ub0b4 \uba58\ud2b8\ub97c \uac01\uac01 \uc791\uc131\ud574\uc918. \uc0ac\uacfc, \ubcc0\uacbd \uc2dc\uac04, \ubb38\uc758 \uacbd\ub85c\ub97c \ud3ec\ud568\ud558\uace0 \uacfc\uc7a5\ub41c \ubcf4\uc0c1 \ud45c\ud604\uc740 \ube7c\uc918." }
          ]
        }
      ]
    },
    {
      id: 'vba',
      label: 'Excel',
      title: '',
      description: '',
      sections: [
        {
          type: 'tip',
          title: "\ud3f4\ub354\uc0dd\uc131",
          icon: 'create_new_folder',
          items: [
            "[[Agent AI \uc0ac\uc6a9\uc744 \uc704\ud574 \uac00\uc7a5 \uba3c\uc800 \ud574\uc57c \ud558\ub294 \uac83\uc740 \ud3f4\ub354 \uc0dd\uc131\uc785\ub2c8\ub2e4.]]",
            "\uc791\uc5c5\ud558\ub294 \ud504\ub85c\uc81d\ud2b8 \ubcc4\ub85c \ud3f4\ub354\ub97c \uc0dd\uc131\ud574\uc11c \uad6c\ubd84\ud569\ub2c8\ub2e4.",
            "\uc6d0\ud558\ub294 \ud3f4\ub354(\uc5d1\uc140 VBA)\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4.",
            "[[VS Code\ub97c \uc2e4\ud589\ud558\uace0, \ud30c\uc77c -> \ud3f4\ub354 \uc5f4\uae30\ub85c \ud574\ub2f9 \ud3f4\ub354\ub97c \uc120\ud0dd\ud569\ub2c8\ub2e4.]]"
          ]
        },
        {
          type: 'prompts',
          title: "\uc5d1\uc140 \ub2e4\ub8e8\uae30",
          icon: 'edit_note',
          hint: "\u261e \ud504\ub86c\ud504\ud2b8 \ubcf5\uc0ac\ud574\uc11c Codex \ucc44\ud305\ucc3d\uc5d0 \ubd99\uc5ec\ub123\uae30",
          prompts: [
            {
              label: "\uc784\uc758 \ub370\uc774\ud130 \uc0dd\uc131",
              text: "\ubcf5\uc9c0\uad00\uc744 \uc774\uc6a9\ud558\ub294 \ud604\ud669\uc744 \uc2e4\uc81c \uc874\uc7ac\ud558\uc9c0 \uc54a\ub294 \uac00\uc0c1\uc758 \ub370\uc774\ud130\ub85c 1\ub9cc\ud589 \uc0dd\uc131\ud574.\n\uc8fc\uc18c\ub294 \ud55c\uad6d\uc758 \uc11c\uc6b8 \uc8fc\uc18c\ub85c \ub79c\ub364\ud558\uac8c \uc0dd\uc131\ud574, \uc774\ub984\uc740 \ud55c\uad6d \uc774\ub984\uc73c\ub85c \ud574\n\uceec\ub7fc\uc740 \uc774\uc6a9\uc790\ucf54\ub4dc, \uc774\uc6a9\uc790\uba85, \uc131\ubcc4, \uc5f0\ub77d\ucc98, \uc7a5\uc560\uad6c\ubd84, \uc7a5\uc560\ub4f1\uae09, \uc8fc\uc18c, \ubcf4\ud638\uc790\uba85, \ubcf4\ud638\uc790 \uc5f0\ub77d\ucc98, \ub2f4\ub2f9 \ubcf5\uc9c0\uc0ac \ub4f1\ub4f1... \ub124\uac00 \ub354 \uace0\ubbfc\ud574\uc11c \uceec\ub7fc\uc744 \ucd94\uac00\ud574\uc918\n\uc0dd\uc131\ub41c \ub370\uc774\ud130\ub294 \uc774\uc6a9\ud604\ud669.xlsx \ud30c\uc77c\ub85c \ud604\uc7ac \ud504\ub85c\uc81d\ud2b8 \ud3f4\ub354\uc5d0 \uc800\uc7a5\ud574\uc918"
            },
            {
              label: "\ud14d\uc2a4\ud2b8 \ucd94\ucd9c",
              text: "\ud604\uc7ac \ud65c\uc131\ud654\ub41c \uc5d1\uc140 \ud30c\uc77c \uc2dc\ud2b8\uc758 H\uc5f4\uc758 \uc8fc\uc18c\uc5d0\uc11c \uac15\ub0a8\uad6c, \ub3d9\uc791\uad6c \ud615\ud0dc\uc758 \uad6c\ub97c \ucd94\ucd9c\ud574\uc11c R\uc5f4\uc5d0 \ucd9c\ub825\ud574"
            },
            {
              label: "\ub370\uc774\ud130 \ubd84\ub958",
              text: "K\uc5f4\uc758 \ubcf5\uc9c0\uad00\uba85\uc744 \uae30\uc900\uc73c\ub85c \uc2dc\ud2b8\ub97c \uc0dd\uc131\ud558\uace0 \ud574\ub2f9 \ubcf5\uc9c0\uad00\ubcc4 \ub370\uc774\ud130\ub97c \ubcf5\uc0ac\ud574"
            }
          ]
        },
        {
          type: 'tip',
          title: "VBA \ucf54\ub4dc \uc2e4\ud589 \ubc29\ubc95",
          icon: 'lightbulb',
          items: [
            "Excel\uc774 \uc5f4\ub9b0 \uc0c1\ud0dc\uc5d0\uc11c [Alt] + [F11] \ud0a4\ub97c \ub20c\ub7ec VBA \ud3b8\uc9d1\uae30\ub97c \uc5fd\ub2c8\ub2e4.",
            "\uc0c1\ub2e8 \uba54\ub274\uc5d0\uc11c [\uc0bd\uc785] - [\ubaa8\ub4c8]\uc744 \ud074\ub9ad\ud574 \ucf54\ub4dc\ub97c \uc791\uc131\ud560 \ube48 \ucc3d\uc744 \ucd94\uac00\ud569\ub2c8\ub2e4.",
            "\uc0dd\uc131\ud615 AI\uac00 \uc791\uc131\ud574 \uc900 \ucf54\ub4dc\ub97c \ubcf5\uc0ac\ud574 \ube48 \ubaa8\ub4c8 \ucc3d\uc5d0 \uadf8\ub300\ub85c \ubd99\uc5ec\ub123\uc2b5\ub2c8\ub2e4.",
            "\ucf54\ub4dc \ucc3d \uc548\uc5d0 \ucee4\uc11c\ub97c \ub450\uace0 [F5]\ub97c \ub204\ub974\uac70\ub098 \uc2e4\ud589 \ubc84\ud2bc\uc744 \ud074\ub9ad\ud558\uba74 \ucf54\ub4dc\uac00 \ubc14\ub85c \uc2e4\ud589\ub429\ub2c8\ub2e4."
          ]
        },
        {
          type: 'prompts',
          title: 'VBA 코드',
          icon: 'code',
          prompts: [
            {
              label: '고급필터 VBA',
              tool: 'vba',
              text: "Option Explicit\n\nPublic \uc870\uac74_temp As Range\nPublic \uacb0\uacfc_temp As Range\nPublic \ubc94\uc704_temp As Range\nPublic \ud544\ub4dc\uba85_temp As Variant\nPublic sht_temp As Worksheet\nPublic sht1_temp As Worksheet\nPublic NewSheet As Worksheet\n\n\n\nSub \uace0\uae09\ud544\ud130\uc2e4\ud589()\n\nDim \uc2dc\uc791\ud589, \ub9c8\uc9c0\ub9c9\ud589, \uc2dc\uc791\uc5f4, \ub9c8\uc9c0\ub9c9\uc5f4, \uace0\uae09\ud544\ud130\ub370\uc774\ud130\nDim \ub370\uc774\ud130\uc2dc\ud2b8 As String, ws, dict As Object, nm, wb\n\n\n\n'#Vba \uc2e4\ud589\ud560\ub54c\nOn Error Resume Next        ' \ucde8\uc18c\ud588\uc744\ub54c \uc5d0\ub7ec\uac00 \ub098\uae30\ub54c\ubb38\uc5d0 \ub2e4\uc74c\uc73c\ub85c \uc9c4\ud589... \uadf8\ub9ac\uace0 \uac12\uc774 \uc5c6\uc73c\ub2c8\uae4c \ub098\uac00\ub77c\ub294 \uad6c\ubb38 \ucd94\uac00\n    Set \ubc94\uc704_temp = Application.InputBox(\"\u203b Data sheet\uc758 \uccab\ubc88\uc9f8 \ud544\ub4dc\uba85\uc744 \uc120\ud0dd\ud574 \uc8fc\uc138\uc694 !\", \"\ub370\uc774\ud130 \uc601\uc5ed \uc120\ud0dd\", Type:=8)\n    \ub370\uc774\ud130\uc2dc\ud2b8 = \ubc94\uc704_temp.Parent.Name\nOn Error GoTo 0\nIf \ubc94\uc704_temp Is Nothing Then Exit Sub\n\n\n\nSet wb = \ubc94\uc704_temp.Parent.Parent\nSet dict = CreateObject(\"Scripting.Dictionary\")\n\n    For Each nm In wb.Names\n        dict.Add nm.Name, Nothing\n    Next nm\n\n    'If dict.exists(\"\uace0\uae09\ud544\ud130\ub370\uc774\ud130\") Then wb.Names(\"\uace0\uae09\ud544\ud130\ub370\uc774\ud130\").Delete\n    Names.Add Name:=Replace(\ub370\uc774\ud130\uc2dc\ud2b8, \" \", \"\") & \"\uace0\uae09\ud544\ud130\ub370\uc774\ud130\", RefersTo:=\ubc94\uc704_temp.CurrentRegion\n    \n\n\nSet sht_temp = Sheets(\ub370\uc774\ud130\uc2dc\ud2b8)\nSet NewSheet = Sheets.Add(After:=sht_temp)\nNewSheet.Name = \ub370\uc774\ud130\uc2dc\ud2b8 & \"_\uace0\uae09\ud544\ud130\"\nNewSheet.Tab.Color = 15773696\n\n' \uc0dd\uc131\ub41c \uace0\uae09\ud544\ud130 \uc2dc\ud2b8\ub97c \ubcc0\uc218\ub85c \uc9c0\uc815\nSet sht1_temp = Sheets(NewSheet.Name)\n    sht1_temp.Range(\"b1\") = Replace(\ub370\uc774\ud130\uc2dc\ud2b8, \" \", \"\") & \"\uace0\uae09\ud544\ud130\ub370\uc774\ud130\"\n    'sht1_temp.Range(\"b1\").Font.ThemeColor = xlThemeColorDark1\n    sht1_temp.Range(\"b1\").Font.ColorIndex = 15\n    sht1_temp.Range(\"b1\").ShrinkToFit = True\n    \n\n\n'\u2605 \ub370\uc774\ud130\ub85c \uc0ac\uc6a9\ud560 \uc790\ub8cc\uac00, \ud544\ub4dc\uba85 \uc704\uc5d0 \ubd88\ud544\uc694\ud55c \ub0b4\uc6a9\ub4e4\uc774 \uc788\uc744 \uc218 \uc788\uc5b4... \uc2dc\uc791\ud544\ub4dc\ub97c \uc9c0\uc815\ud558\uc5ec \ub370\uc774\ud130\uc758 \ubc94\uc704\ub97c \uc0b0\ucd9c\n\uc2dc\uc791\ud589 = \ubc94\uc704_temp.row\n\ub9c8\uc9c0\ub9c9\ud589 = Sheets(\ub370\uc774\ud130\uc2dc\ud2b8).UsedRange.Rows.Count\n\uc2dc\uc791\uc5f4 = \ubc94\uc704_temp.Column\n\ub9c8\uc9c0\ub9c9\uc5f4 = sht_temp.Cells(\uc2dc\uc791\ud589, Columns.Count).End(xlToLeft).Column\n\n' \uc774\uac74 \ub370\uc774\ud130 \ubc94\uc704\ub97c \uc815\ud655\ud558\uac8c \uc9c0\uc815\ud55c\uac83.. \ubc18\ub4dc\uc2dc \ub370\uc774\ud130\uc758 \uccab\ud589\uc744 \uc120\ud0dd\ud574\uc57c\ud568\n'Set \ubc94\uc704_temp = sht_temp.Range(sht_temp.Cells(\uc2dc\uc791\ud589, \uc2dc\uc791\uc5f4), sht_temp.Cells(\ub9c8\uc9c0\ub9c9\ud589, \ub9c8\uc9c0\ub9c9\uc5f4))\n' \uc774\uac74 \ub370\uc774\ud130 \ud544\ub4dc\uba85 \uc544\ubb34\ub370\ub098 \uc120\ud0dd\ud558\uac8c\nSet \ubc94\uc704_temp = \ubc94\uc704_temp.CurrentRegion\n\n\n\ud544\ub4dc\uba85_temp = \ubc94\uc704_temp.Resize(1, \ubc94\uc704_temp.Columns.Count)\n    \nsht1_temp.Range(\"e3:k3\").Interior.ColorIndex = 15\nsht1_temp.Range(\"e10\").Resize(1, UBound(\ud544\ub4dc\uba85_temp, 2)) = \ud544\ub4dc\uba85_temp\nsht1_temp.Range(\"e10\").Resize(1, UBound(\ud544\ub4dc\uba85_temp, 2)).Interior.ColorIndex = 15\nsht1_temp.Range(\"e10\").Resize(1, UBound(\ud544\ub4dc\uba85_temp, 2)).Columns.AutoFit\nsht1_temp.Range(\"e10\").Resize(1, UBound(\ud544\ub4dc\uba85_temp, 2)).HorizontalAlignment = xlCenter\nsht1_temp.Range(\"e10\").Resize(1, UBound(\ud544\ub4dc\uba85_temp, 2)).VerticalAlignment = xlCenter\nsht1_temp.Range(\"a2\").RowHeight = 30\nsht1_temp.Range(\"a9\").RowHeight = 30\n\n\uac80\uc0c9\ub2e8\ucd94_\uc0bd\uc785\n\nsht1_temp.Columns(\"A:d\").ColumnWidth = 1\nsht1_temp.Range(\"b3\") = \"\uac80\uc0c9_\uc870\uac74 \u261e\"\nsht1_temp.Range(\"b3\").Font.Size = 15\nsht1_temp.Range(\"b3\").Interior.ColorIndex = 6\nsht1_temp.Range(\"b10\") = \"\uac80\uc0c9_\uacb0\uacfc \u261e\"\nsht1_temp.Range(\"b10\").Font.Size = 15\nsht1_temp.Range(\"b10\").Interior.ColorIndex = 40\nsht1_temp.Range(\"b3\").Columns.AutoFit\nsht1_temp.Range(\"a1\").Select\n\nEnd Sub\n\n\nSub \uac80\uc0c9\ub2e8\ucd94_\uc0bd\uc785()\n\n'\uac80\uc0c9\ub2e8\ucd94\nDim \uc67c\ucabd, \ud0d1\n    \uc67c\ucabd = NewSheet.Range(\"e2\").Left\n    \ud0d1 = NewSheet.Range(\"e2\").Top\n\n'\n    NewSheet.Shapes.AddShape(msoShapeRoundedRectangle, \uc67c\ucabd, \ud0d1, 100, 25).Select\n    \n    With Selection\n        .ShapeRange.Name = \"\ub529\ub3d9\ub311\"\n        .Name = \"\ub529\ub3d9\ub311\"\n        .ShapeRange.Line.Visible = msoFalse\n        .Placement = xlFreeFloating\n        \n        '\u2605\u2605\u2605 \uc5ec\uae30\uc5d0\uc11c \ud37c\uc2a4\ub110 \ud30c\uc77c \uc774\ub984\uc774 \ub2e4\ub974\ub2e4\uba74 \ubcc0\uacbd\ud544\uc694 !!!!\n        '.OnAction = \"\uc2dc\uc791.xlsm!\uac80\uc0c9\ubaa8\ub4c8\"\n        .OnAction = ThisWorkbook.Name & \"!\uac80\uc0c9\ubaa8\ub4c8\"\n        \n        .Placement = xlFreeFloating\n    End With\n    \n    With Selection.ShapeRange.Fill\n        .Visible = msoTrue\n        .ForeColor.RGB = RGB(0, 176, 240)\n        .Transparency = 0\n        .Solid\n    End With\n    \n    Selection.ShapeRange(1).TextFrame2.TextRange.Characters.text = \"\uac80 \uc0c9\"\n    Selection.ShapeRange.TextFrame2.TextRange.ParagraphFormat.Alignment = msoAlignCenter\n    Selection.ShapeRange.TextFrame2.VerticalAnchor = msoAnchorMiddle\n    Selection.Placement = xlMove\n    \n    \n'\uc870\uac74\ud544\ub4dc\ub2e8\ucd94\nDim \uc67c\ucabd_1, \ud0d1_1\n    \uc67c\ucabd_1 = NewSheet.Range(\"e9\").Left\n    \ud0d1_1 = NewSheet.Range(\"e9\").Top\n\n'\n    NewSheet.Shapes.AddShape(msoShapeRoundedRectangle, \uc67c\ucabd_1, \ud0d1_1, 100, 25).Select\n    \n    With Selection\n        .ShapeRange.Name = \"\ub529\ub3d9\ub311\ub3d9\"\n        .Name = \"\ub529\ub3d9\ub311\ub3d9\"\n        .ShapeRange.Line.Visible = msoFalse\n        .Placement = xlFreeFloating\n        \n        '\u2605\u2605\u2605 \uc5ec\uae30\uc5d0\uc11c \ud37c\uc2a4\ub110 \ud30c\uc77c \uc774\ub984\uc774 \ub2e4\ub974\ub2e4\uba74 \ubcc0\uacbd\ud544\uc694 !!!!\n        '.OnAction = \"\uc2dc\uc791.xlsm!\uc870\uac74\uc120\ud0dd\"\n        .OnAction = ThisWorkbook.Name & \"!\uc870\uac74\uc120\ud0dd\"\n        \n        .Placement = xlFreeFloating\n    End With\n    \n    With Selection.ShapeRange.Fill\n        .Visible = msoTrue\n        .ForeColor.RGB = RGB(128, 0, 0)\n        .Transparency = 0\n        .Solid\n    End With\n    \n    Selection.ShapeRange(1).TextFrame2.TextRange.Characters.text = \"\uc870\uac74\ud544\ub4dc_\uc120\ud0dd\"\n    Selection.ShapeRange.TextFrame2.TextRange.ParagraphFormat.Alignment = msoAlignCenter\n    Selection.ShapeRange.TextFrame2.VerticalAnchor = msoAnchorMiddle\n    Selection.Placement = xlMove\n    \n    \n'\ub370\uc774\ud130\ubcf4\uc5ec\uc918 \ub2e8\ucd94\nDim \uc67c\ucabd_2, \ud0d1_2\n    \uc67c\ucabd_2 = NewSheet.Range(\"b9\").Left\n    \ud0d1_2 = NewSheet.Range(\"b9\").Top\n\n'\n    NewSheet.Shapes.AddShape(msoShapeRoundedRectangle, \uc67c\ucabd_2, \ud0d1_2, 80, 25).Select\n    \n    With Selection\n        .ShapeRange.Name = \"\ub529\ub3d9\ub311\ub3d9\ub529\"\n        .Name = \"\ub529\ub3d9\ub311\ub3d9\ub529\"\n        .ShapeRange.Line.Visible = msoFalse\n        .Placement = xlFreeFloating\n        \n        '\u2605\u2605\u2605 \uc5ec\uae30\uc5d0\uc11c \ud37c\uc2a4\ub110 \ud30c\uc77c \uc774\ub984\uc774 \ub2e4\ub974\ub2e4\uba74 \ubcc0\uacbd\ud544\uc694 !!!!\n        '.OnAction = \"\uc2dc\uc791.xlsm!\ub370\uc774\ud130\ubcf4\uc5ec\uc918\"\n        .OnAction = ThisWorkbook.Name & \"!\ub370\uc774\ud130\ubcf4\uc5ec\uc918\"\n        \n        .Placement = xlFreeFloating\n    End With\n    \n    With Selection.ShapeRange.Fill\n        .Visible = msoTrue\n        .ForeColor.RGB = RGB(51, 51, 51)\n        .Transparency = 0\n        .Solid\n    End With\n    \n    Selection.ShapeRange(1).TextFrame2.TextRange.Characters.text = \"\ub370\uc774\ud130_\uccab\ud589\ub9cc\"\n    Selection.ShapeRange.TextFrame2.TextRange.ParagraphFormat.Alignment = msoAlignCenter\n    Selection.ShapeRange.TextFrame2.VerticalAnchor = msoAnchorMiddle\n    Selection.Placement = xlMove\n    \nEnd Sub\n\n\n\n\nSub \uac80\uc0c9\ubaa8\ub4c8()\n\nDim Table_Temp As Range, \ub370\uc774\ud130\uc9c0\uc815, \ub370\uc774\ud130, \ub05d\uc5f4, \uc870\uac74, \uacb0\uacfc, WBname, \ud0c0\uac9f, \uc774\ub984, ws, wb, j, nm\n\n    Set \uc870\uac74 = ActiveSheet.Range(\"e3\").CurrentRegion\n    Set \uacb0\uacfc = ActiveSheet.Range(\"e10\").CurrentRegion\n    Set \uacb0\uacfc = \uacb0\uacfc.Resize(1, \uacb0\uacfc.Columns.Count)\n    \n    \uacb0\uacfc.CurrentRegion.Offset(1, 0).ClearContents\n    \uc774\ub984 = Range(\"b1\")\n    \nRange(\uc774\ub984).AdvancedFilter Action:=xlFilterCopy, CriteriaRange:=\uc870\uac74, CopyToRange:=\uacb0\uacfc, Unique:=False\n\n   \n\nEnd Sub\n\n\n\nSub \uc804\uc5ed\ubcc0\uc218_\ube44\uc6b0\uae30()\n\nSet \uc870\uac74_temp = Nothing\nSet \uacb0\uacfc_temp = Nothing\nSet \ubc94\uc704_temp = Nothing\nSet sht_temp = Nothing\n'Set NewSheet = Nothing\nErase \ud544\ub4dc\uba85_temp\n\nEnd Sub\n\nSub \uc2dc\ud2b8\uba85\ud655\uc778()\n\nSheets(\"\ucd9c\ub8251\").Previous.UsedRange\nSheets(\"\ucffc\ub9ac\").Next.UsedRange\n\nEnd Sub\n\n\n'\uac04\ub2e8 \uc0d8\ud50c \ucf54\ub4dc\n'Range(\"\ub370\uc774\ud130\").AdvancedFilter xlFilterCopy, Range(\"\uc870\uac74\"), Range(\"\uacb0\uacfc\")\n\n\n\nSub \uc870\uac74\uc120\ud0dd()\n\nDim \ud544\ub4dc\uba85 As Range\n    Set \ud544\ub4dc\uba85 = Application.InputBox(\"\uc870\uac74\uc73c\ub85c \uc0ac\uc6a9\ud560 \ud544\ub4dc\uba85\uc744 \uc120\ud0dd\ud558\uc138\uc694\", \"\ud544\ub4dc\uba85 \uc120\ud0dd\", , , , , , 8)\n    \nDim a(), x, b\nb = 0\nFor Each x In \ud544\ub4dc\uba85\n    ReDim Preserve a(b)\n    a(b) = x\n    b = b + 1\nNext\n\nDim \ub05d\uc5f4\nIf NewSheet.Range(\"e3\") = \"\" Then\n    \ub05d\uc5f4 = 5\nElse\n    \ub05d\uc5f4 = NewSheet.Cells(3, Columns.Count).End(xlToLeft).Column + 1\nEnd If\n    \nDim \ubcf5\uc0ac\uc704\uce58 As Range\n    Set \ubcf5\uc0ac\uc704\uce58 = NewSheet.Cells(3, \ub05d\uc5f4)\n    \n\ubcf5\uc0ac\uc704\uce58.Resize(1, \ud544\ub4dc\uba85.Count) = a\n\nNewSheet.Range(\"e3:k3\").HorizontalAlignment = xlCenter\nNewSheet.Range(\"e3:k3\").VerticalAlignment = xlCenter\nNewSheet.Range(\"e3:k3\").ShrinkToFit = True\n\nEnd Sub\n\n\nSub \ub370\uc774\ud130\ubcf4\uc5ec\uc918()\n\nDim \ub370\uc774\ud130 As Range, \uacb0\uacfc, \uc774\ub984\n\uc774\ub984 = Range(\"b1\")\n\nSet \ub370\uc774\ud130 = Range(\uc774\ub984)\nRange(\"e11\").Resize(1, \ub370\uc774\ud130.Columns.Count) = \ub370\uc774\ud130.Offset(1, 0).Resize(1, \ub370\uc774\ud130.Columns.Count).Value\n\nEnd Sub\n"
            }
          ]
        }
      ]
    },
    {
      id: 'distribution',
      label: '프로그램 만들기',
      title: '프로그램 만들기',
      description: '',
      sections: [
        {
          type: 'prompts',
          title: '',
          icon: 'edit_note',
          className: 'prompt-list--program-builder',
          prompts: [
            {
              label: '프롬프트 1',
              tool: 'cursor',
              editable: true,
              text: '',
              notePad: true
            },
            {
              label: '프롬프트 2',
              tool: 'cursor',
              editable: true,
              text: '',
              notePad: true
            },
            {
              label: '프롬프트 3',
              tool: 'cursor',
              editable: true,
              text: '',
              notePad: true
            }
          ]
        }
      ]
    },
    {
      id: 'python',
      label: 'Python 분석',
      topic: 'Topic 2',
      title: '2.A. Python 코드 기반 분석 및 보고서 생성',
      description: 'Python과 Jupyter Notebook으로 데이터를 읽고, 집계·시각화·보고서를 생성합니다.',
      sections: [
        {
          type: 'note',
          text: 'Python 코드는 문서에 고정해두기보다 Cursor와 Gemini에게 요청해 생성하고 실행 결과를 확인합니다. 입력 데이터는 resource/data/홈앤서비스_설치장애_접수현황.xlsx를 기준으로 사용하고, 결과는 outputs/reports 폴더에 저장합니다.'
        },
        {
          type: 'files',
          title: '실습 데이터',
          icon: 'table_chart',
          files: [
            { name: '홈앤서비스_설치장애_접수현황.xlsx', description: 'Python 분석 실습의 기본 입력 데이터', icon: 'excel', path: 'resource/data/홈앤서비스_설치장애_접수현황.xlsx' },
            { name: 'template.pptx', description: 'PPTX 보고서 생성 시 활용할 템플릿 (있을 경우)', icon: 'local', path: 'resource/pptx/template.pptx' }
          ]
        },
        {
          type: 'prompts',
          title: 'Python 실습 프롬프트',
          icon: 'code',
          prompts: [
            { label: 'Python 파일 만들고 실행하기', tool: 'cursor', text: '현재 프로젝트 폴더에서 hello_python.py 파일을 만들고 실행하는 절차를 알려줘.\n[요청]\n1. Cursor에서 새 .py 파일을 만드는 방법\n2. print("Hello, Python!") 예제 코드\n3. 터미널에서 python hello_python.py 명령어로 실행하는 방법\n4. 실행이 안 될 때 확인할 항목\n5. 터미널을 열고 닫는 기본 단축키를 함께 정리해줘.' },
            { label: 'Jupyter Notebook 시작하기', tool: 'both', text: 'Cursor에서 Jupyter Notebook(.ipynb)을 만들고 실행하는 방법을 알려줘.\n[포함할 내용]\n1. 새 .ipynb 파일 만들기\n2. Python 커널 선택하기\n3. pandas, matplotlib, seaborn, plotly를 import하는 첫 셀 작성\n4. 셀 실행 방법\n5. 노트북에서 Excel 분석을 진행할 때 .py 파일과 다른 점' },
            { label: 'Jupyter에서 Excel 데이터 분석', tool: 'both', text: 'resource/data/홈앤서비스_설치장애_접수현황.xlsx 파일을 Jupyter Notebook에서 pandas로 읽고 분석하는 예제 코드를 만들어줘.\n[분석 내용]\n1. 파일 읽기와 상위 5행 확인\n2. 컬럼명, 자료형, 결측치 개수 확인\n3. 업무유형, 처리상태, 자치구 기준 접수건수 집계\n4. 처리시간분 평균과 지연시간분 평균 계산\n5. 처리상태별 건수 막대그래프 작성\n6. 결과를 outputs/reports/home_service_jupyter_summary.xlsx로 저장' },
            { label: 'DRM/문서보안 Excel 처리', tool: 'both', text: '문서보안(DRM)이 적용된 Excel 파일을 Python에서 처리해야 하는 상황이야.\n[요청]\n1. pandas로 읽히지 않을 때 발생할 수 있는 증상\n2. xlwings 또는 pywin32를 활용하는 접근 방법\n3. 이미 열려 있는 Excel 파일에서 데이터를 읽는 예시 코드\n4. 원본 파일을 훼손하지 않고 사본 또는 결과 파일로 저장하는 방법\n5. 개인정보와 내부 문서 보안 측면에서 주의할 점을 정리해줘.' },
            { label: '데이터 구조 확인', tool: 'both', text: 'resource/data/홈앤서비스_설치장애_접수현황.xlsx 파일을 pandas로 읽어서 데이터 구조를 확인하는 Python 코드를 만들어줘. 출력에는 상위 5행, 컬럼명, 자료형, 결측치 개수, 숫자형/문자형 요약 통계가 포함되어야 해. 결과는 outputs/reports/home_service_data_profile.xlsx 파일로도 저장해줘.' },
            { label: '개인정보 의심 컬럼 탐색', tool: 'both', text: 'resource/data/홈앤서비스_설치장애_접수현황.xlsx에서 개인정보 또는 민감정보로 보이는 컬럼과 값을 탐색하는 Python 코드를 만들어줘. 원본 값은 그대로 저장하지 말고 마스킹된 샘플만 outputs/reports/home_service_pii_scan_result.xlsx에 저장해줘.' },
            { label: '설치 현황 집계와 시각화', tool: 'both', text: 'resource/data/홈앤서비스_설치장애_접수현황.xlsx를 읽어서 설치와 장애 접수 현황 분석 코드를 만들어줘. 자치구, 업무유형, 처리상태, 담당센터 기준으로 건수와 평균 지연일수를 집계하고, matplotlib 또는 plotly로 차트를 저장해줘. 결과 파일은 outputs/reports/home_service_summary.xlsx와 outputs/reports/home_service_status_chart.png로 저장해줘.' },
            { label: 'PPTX/DOCX 보고서 자동 생성', tool: 'both', text: 'outputs/reports/home_service_summary.xlsx와 outputs/reports/home_service_status_chart.png를 사용해서 보고서 파일을 자동 생성하는 Python 코드를 만들어줘.\n[요청]\n1. python-pptx로 6장 내외의 PPTX 발표자료\n2. python-docx로 2페이지 내외의 DOCX 업무 보고서\n3. PPTX에는 제목, 핵심 KPI, 지역별 차트, 지연 상위 10건, 개선 제안, 후속 조치 슬라이드\n4. resource/pptx/template.pptx가 있으면 활용\n5. 결과: outputs/reports/home_service_report.pptx, home_service_report.docx' }
          ]
        }
      ]
    },
    {
      id: 'dashboard',
      label: '대시보드/GUI',
      topic: 'Topic 3',
      title: '3.A. 웹 데이터, GUI, 대시보드 프로그램 작성',
      description: '웹 스크래핑, PyQt GUI, Streamlit 대시보드로 분석 결과를 업무 도구로 확장합니다.',
      sections: [
        {
          type: 'note',
          text: 'PyQt는 로컬 실행 도구, Streamlit은 브라우저 기반 대시보드에 활용합니다. 실행 파일과 결과 파일 위치는 outputs 폴더 기준으로 정리합니다.'
        },
        {
          type: 'prompts',
          title: '웹 스크래핑',
          icon: 'language',
          prompts: [
            { label: '웹 스크래핑 기본 흐름', tool: 'both', text: 'Python에서 웹 스크래핑을 진행하는 절차와 주의사항을 정리해줘.\n[포함할 내용]\n1. BeautifulSoup와 Selenium 사용 차이\n2. id, class, CSS selector, xpath로 요소 찾기\n3. robots.txt, 서비스 약관, 개인정보 수집 주의사항\n4. 요청 간격을 두고 과도한 접속을 피하는 방법\n5. 수집 결과를 CSV 또는 Excel로 저장하는 기본 코드 구조' },
            { label: '공지 페이지 수집 코드', tool: 'cursor', text: '로그인 없이 접근 가능한 공개 공지 페이지에서 제목, 작성일, 링크를 수집해 Excel로 저장하는 Python 예제 코드를 만들어줘.\n[요청]\n1. requests와 BeautifulSoup 기반 코드\n2. 페이지 URL은 변수로 분리\n3. outputs/reports/notice_list.xlsx로 저장\n4. 보안, 약관, 개인정보 주의사항을 코드 주석으로 포함' }
          ]
        },
        {
          type: 'prompts',
          title: 'PyQt GUI',
          icon: 'desktop_windows',
          prompts: [
            { label: 'PyQt GUI 기본 구조', tool: 'both', text: 'Python의 PyQt5로 GUI 프로그램을 만들 때 기본 구조를 설명해줘.\n[포함할 내용]\n1. 파일 선택 버튼\n2. 실행 버튼\n3. 진행 로그 표시 영역\n4. 결과 파일 저장 위치 표시\n5. 오류 메시지 표시\n6. 전체 코드를 .py 파일로 저장하고 터미널에서 실행하는 방법' },
            { label: '설치 현황 분석 GUI', tool: 'cursor', text: 'PyQt5로 설치 현황 분석 GUI를 만들어줘. 사용자가 Excel 파일을 선택하고, 분석 실행 버튼을 누르면 pandas로 집계한 뒤 결과 Excel과 차트 이미지를 저장하게 해줘. 코드 파일은 app_pyqt.py로 만들고 실행 방법도 알려줘.' }
          ]
        },
        {
          type: 'prompts',
          title: 'Streamlit 대시보드',
          icon: 'dashboard',
          prompts: [
            { label: 'Streamlit 실행 방법', tool: 'both', text: 'Streamlit 대시보드를 실행하고 수정하는 기본 절차를 알려줘.\n[포함할 내용]\n1. app_streamlit.py 파일 저장 위치\n2. streamlit run app_streamlit.py 실행 방법\n3. 브라우저가 자동으로 열리지 않을 때 주소 확인\n4. Ctrl + C로 종료 후 수정·재실행\n5. requirements.txt에 필요한 라이브러리 정리' },
            { label: 'Streamlit 대시보드 생성', tool: 'cursor', text: 'outputs/reports/home_service_summary.xlsx의 결과 파일을 읽어 Streamlit 대시보드 app_streamlit.py를 만들어줘. 첫 화면에는 KPI 3개, 필터, 주요 차트, 결과표, Excel 다운로드 버튼을 배치해줘. DESIGN.md의 색상과 표 규칙을 따라줘. 앱 실행 파일은 outputs/dashboard 폴더에 저장해줘.' }
          ]
        }
      ]
    },
    {
      id: 'schedule',
      label: '스케줄링/API',
      topic: 'Topic 3',
      title: '3.B. 스케줄링과 API의 활용',
      description: 'Windows 작업 스케줄러, Gemini API, SMTP 메일 자동화로 분석 결과를 정기적으로 운영합니다.',
      sections: [
        {
          type: 'note',
          text: 'Gemini API Key는 코드에 직접 쓰지 않고 .env 파일에서 읽어옵니다. 자동 생성된 요약 파일과 보고 메일은 outputs 폴더 기준으로 관리합니다.'
        },
        {
          type: 'prompts',
          title: '자동화 프롬프트',
          icon: 'schedule',
          prompts: [
            { label: 'Windows 작업 스케줄러 등록', tool: 'cursor', text: 'Windows 작업 스케줄러에 Python 분석 스크립트를 등록하는 절차를 알려줘.\n[상황]\n- 실행할 스크립트: src/run_home_service_report.py\n- 입력: resource/data/홈앤서비스_설치장애_접수현황.xlsx\n- 결과 폴더: outputs/reports\n- 실행 주기: 매주 월요일 오전 8시\n[요청]\n1. run_home_service_report.bat 예시 작성\n2. 작업 스케줄러 등록 방법\n3. 로그 파일 outputs/logs/scheduler.log\n4. 실패 시 확인 항목\n5. 개인정보 원본 파일 외부 복사 주의사항' },
            { label: 'Gemini API 요약 유틸', tool: 'cursor', text: 'Gemini API를 호출해서 홈앤서비스 접수 현황 요약 문안을 생성하는 Python 코드를 만들어줘.\n[전제]\n- GEMINI_API_KEY는 .env 파일에 저장\n- API Key를 코드에 직접 적거나 출력하지 않음\n- 입력: outputs/reports/home_service_summary.xlsx\n- 출력: outputs/reports/gemini_operation_summary.md\n[요청]\n1. python-dotenv로 .env 읽기\n2. API Key 없을 때 친절한 오류 메시지\n3. 팀장 보고용 5줄 요약과 후속 조치 3개 생성' },
            { label: 'SMTP 보고 메일 자동화', tool: 'cursor', text: 'SMTP를 사용해서 홈앤서비스 접수 현황 보고 메일을 발송하는 Python 코드를 만들어줘.\n[전제]\n- SMTP 정보는 .env의 SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD\n- 실제 발송 전 테스트 수신자에게만 발송\n- 첨부: home_service_report.pptx, home_service_report.docx\n- 본문: gemini_operation_summary.md\n[요청]\n1. .env에서 SMTP 정보 읽기\n2. 첨부파일 없을 때 발송하지 않고 오류 안내\n3. 발송 로그 outputs/logs/mail_send.log\n4. 비밀번호와 API Key가 로그에 남지 않도록 처리' }
          ]
        }
      ]
    },
    {
      id: 'project',
      label: '프로젝트',
      topic: 'Topic 3',
      title: '3.C. 업무 과제 기획서 작성 및 프로토타입 개발',
      description: 'PRD, AGENTS, DESIGN 문서를 작성하고 Cursor로 개인 과제 프로토타입을 개발합니다.',
      sections: [
        {
          type: 'docs',
          title: '프로젝트 문서',
          icon: 'description',
          docs: [
            { name: 'PRD.md', desc: '무엇을 만들지 정합니다. 문제, 사용자, 입력, 처리 흐름, 산출물, 성공 기준을 적습니다.' },
            { name: 'AGENTS.md', desc: '어떻게 작업할지 정합니다. Cursor의 작업 규칙, 실행 명령, 보안 기준, 검증 절차를 적습니다.' },
            { name: 'DESIGN.md', desc: '어떤 모습으로 만들지 정합니다. 화면, 보고서, 표, 차트, 버튼, 경고 색상 기준을 적습니다.' }
          ]
        },
        {
          type: 'files',
          title: '프로젝트 템플릿 파일',
          icon: 'folder_special',
          files: [
            { name: 'PRD.md', description: '프로젝트 요구사항 정의서 템플릿', icon: 'local', path: 'project/PRD.md' },
            { name: 'AGENTS.md', description: 'Cursor 작업 규칙 템플릿', icon: 'local', path: 'project/AGENTS.md' },
            { name: 'DESIGN.md', description: '디자인 기준 템플릿', icon: 'local', path: 'project/DESIGN.md' }
          ]
        },
        {
          type: 'prompts',
          title: '프로젝트 시작 프롬프트',
          icon: 'rocket_launch',
          prompts: [
            { label: '프로젝트 문서 먼저 읽히기', tool: 'cursor', text: '현재 project 폴더의 PRD.md, AGENTS.md, DESIGN.md를 먼저 읽고 이 프로젝트의 목표, 입력 데이터, 산출물, MVP 범위, 보안 주의사항, 디자인 기준을 요약해줘. 아직 구현하지 말고 누락된 요구사항이나 확인 질문을 먼저 알려줘.' }
          ]
        },
        {
          type: 'workflow',
          title: '개인 과제 진행 순서',
          icon: 'checklist',
          steps: [
            'Gemini로 업무 문제를 정리하고 PRD.md 초안을 작성합니다.',
            'project 폴더의 AGENTS.md와 DESIGN.md를 자기 주제에 맞게 수정합니다.',
            'Cursor에 세 문서를 읽게 한 뒤 MVP 구현 범위를 확인합니다.',
            'Python으로 데이터 처리, 보고서, 대시보드, GUI 중 하나를 구현합니다.',
            '실행 명령, 결과 파일, 한계, 다음 개선 계획을 README.md에 정리합니다.'
          ]
        }
      ]
    }
  ]
};

