# Deliverable 1 – Plan Phase

## 1. Team & Repository

- **Team name:** WebTechno  
- **Members:** Iskander Haddar , Azer Kahwech  
- **GitLab Repository:** unter [https://gitlab.bht-berlin.de/isha1934/webtechno] erstellt
- **Dozent eingeladen:** spSpielvogel (Rolle: Reporter) 

## 2. Ordnerstruktur


Wir haben uns für eine skalierbare DevOps-Struktur entschieden, die sowohl Entwicklung (Frontend/Backend)
als auch Infrastruktur (IaC, CI/CD) und Dokumentation klar voneinander trennt.


```

├── app/                   # Anwendungscode (Frontend + Backend)
│   ├── frontend/
│   │   ├── src/
│   │   └── tests/
│   └── backend/
│       ├── src/
│       └── tests/
│
├── infra/                 # Infrastruktur (Terraform, Ansible, K8s)
│   ├── terraform/
│   ├── ansible/
│   └── k8s/
│
├── ci/                    # CI/CD-Pipelines
│   └── .gitlab-ci.yml
│
├── config/                # Globale Konfiguration (Linting, Env)
│   └── .env.example
│
├── scripts/               # Automatisierungsskripte (Build, Deploy, Maintenance)
│
├── docs/                  # Projektdokumentation
│   ├── deliverable1.md
│   ├── decisions/
│   └── diagrams/
│
├── tests/                 # Integration- & End-to-End-Tests
│
├── .gitignore
└── README.md

**Begründung:**  
Diese Struktur folgt DevOps-Best-Practices, fördert Modularität und Automatisierung,
und erleichtert Teamarbeit sowie CI/CD-Integration.  
Sie ist klar, erweiterbar und unterstützt den gesamten Entwicklungszyklus
(Plan → Build → Run → Monitor).



## 3. Kommunikation


- **Werkzeug:** Microsoft Teams
- **Kanal:** Privater Gruppen-Kanal **Projekt-Team** angelegt, in dem alle Team-Mitglieder erreichbar sind.

---
## 4. Auswahl des Projektmanagement-Tools

**Anforderungen:**  
Das Tool soll eine einfache Verwaltung der Aufgaben ermöglichen, ein visuelles Kanban-Board bieten und Kategorien wie *Backlog*, *In Progress* und *Done* unterstützen. Außerdem soll es möglich sein, Aufgaben nach Priorität und Verantwortlichem zu filtern.

| Tool          | Vorteile                                                  | Einschränkungen                     |
|----------------|-----------------------------------------------------------|-------------------------------------|
| **Jira**       | Sehr flexibel, viele Integrationen, gute Reporting-Tools  | Komplexe Einrichtung, kostenpflichtig |
| **Trello**     | Intuitiv, schnell zu nutzen, ideal für kleine Teams       | Begrenzte Funktionen bei großen Projekten |
| **GitLab Issues** | Direkt mit dem Repository verbunden, integriertes Board | Weniger anpassbar als Jira          |

**Unsere Entscheidung:**  
Wir verwenden **GitLab Issues** mit Kanban-Board,  
da es direkt im Repository integriert ist, keine zusätzlichen Lizenzen benötigt.


## 5. Frontend-Framework Entscheidung

**Ziel:**  
Für die Entwicklung der Benutzeroberfläche soll ein modernes Framework verwendet werden, das eine schnelle Umsetzung, gute Wartbarkeit und einfache Integration in CI/CD-Pipelines erlaubt.


| Framework     | Vorteile                                                  | Einschränkungen                        |
|----------------|-----------------------------------------------------------|----------------------------------------|
| React     | Große Community, ausgereiftes Ökosystem, kompatibel mit DevOps-Pipelines | Erfordert Build-Tools und zusätzliche Libraries |
| Vue.js    | Einsteigerfreundlich, klar strukturierte Syntax, leichtgewichtig | Kleinere Community im Vergleich zu React |
| Angular    | Stark typisiert, gute Struktur für große Projekte          | Komplexere Lernkurve, höhere Einstiegshürde |

**Entscheidung:**  
React ist flexibel, CI/CD-freundlich und durch Vite extrem schnell im Build-Prozess.  
TypeScript sorgt zusätzlich für sauberen, wartbaren Code – eine Investition in Qualität und Zukunft. 

--

## Nächste Schritte

- CI/CD-Pipeline konfigurieren
- Erste Tickets im PM-Tool erstellen
- Basis-Template für React-App anlegen

*Ende Deliverable 1.*
