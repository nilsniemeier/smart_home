# Smart Home

Markdown-Konvertierung der Präsentation `Smart Home.pdf` (97 Folien).
Schaubilder liegen in `images/` (eingebettete Bilder) bzw. `images/pages/` (Seitenrenderings für Vektorgrafiken).

---

## Folie 1 — Smart Home

### Smart Home

NILS NIEMEIER

![Illustration eines digitalen Smart Homes](images/img-001-000.png)

> **Beschreibung:** Isometrische, digital wirkende Illustration eines Hauses, dessen Dach und Wände aus fließendem Binärcode (Ziffernkolonnen) und leuchtenden hellblauen Linien bestehen. Auf dem Boden liegt ein Schaltplan-artiges Raster mit Symbolen für Geräte (u. a. Auto, Monitor, Heizung), verbunden durch goldene Leitungen mit roten und grünen Leuchtpunkten. Rechts oben ragt ein Smartphone ins Bild. Die Grafik steht für Vernetzung und Digitalisierung eines Gebäudes.

---

## Folie 2 — Smart Home (Agenda)

- Was ist Smart Home?
- Was ist ihr Zweck
- Aufbau von Smart Home
- Die Funktion
- Welche Anbieter gibt es
- Gefahren von Smart Home
- UVM

![Fotorealistische Visualisierung eines modernen Smart Homes bei Nacht](images/img-002-001.png)

> **Beschreibung:** Gerenderte Ansicht eines zweistöckigen, modernen Wohnhauses in Abend- bzw. Nachtstimmung. Die Fassade ist teils transparent dargestellt, sodass Wohnzimmer, Küche und Schlafzimmer sichtbar sind. Blaue und pinkfarbene LED-Lichtleisten sowie leuchtende blaue Symbol-Overlays deuten auf vernetzte Gebäudetechnik hin. Das Bild vermittelt ein komfortables, automatisiertes Zuhause.

---

## Folie 3 — Was ist Smart Home?

**Smart Home ist die Haus- und Gebäudeautomation, bzw. Domotik und Domotronik.**
**Im Bauwesen bezeichnet sie die Gesamtheit der:**

- Überwachungs-,
- Steuer-,
- Regel- und
- Optimierungseinrichtungen

in Gebäuden.

---

## Folie 4 — Was ist ihr Zweck?

- Wohn- und Lebensqualität verbessern
- Sicherheit erhöhen
- effizienter Energienutzung gewährleisten
- auf Basis vernetzter und fernsteuerbarer Geräte und Installationen sowie automatisierbarer Abläufe

---

## Folie 5 — Der Aufbau von SH

Der **Aufbau eines Smart Homes** lässt sich am besten als ein Vier-Schichten-Modell verstehen. Damit aus normalen Geräten ein intelligentes Zuhause wird, müssen Hardware, Übertragungswege, die zentrale Logik und die Benutzeroberfläche nahtlos zusammenarbeiten.

---

## Folie 6 — Die 4 Schichten des Smart Homes

### 1. Die Feldebene: Sensoren und Aktoren (Die Hardware)

Die physischen Geräte im Haus werden in zwei Hauptgruppen unterteilt:

- **Sensoren (Die "Sinnesorgane"):** Sie nehmen Informationen aus der Umwelt auf und senden sie weiter.
  - *Beispiele:* Bewegungsmelder, Rauchmelder, Fensterkontakte, Temperatursensoren.
- **Aktoren (Die "Muskeln"):** Sie empfangen Befehle und führen eine Aktion aus.
  - *Beispiele:* Smarte Unterputz-Relais (für Licht), Heizkörperthermostate, motorisierte Rollo-Motoren, smarte Steckdosen.

---

## Folie 7 — Die Übertragungsebene: Protokolle (Die Sprache)

**Damit die Geräte miteinander kommunizieren können, nutzen sie ein gemeinsames Protokoll. Hier wird grundsätzlich zwischen zwei Systemen unterschieden:**

- **Funksysteme (Ideal zum Nachrüsten):**
  - **Matter:** Der moderne, herstellerübergreifende IP-Standard (oft in Kombination mit **Thread**).
  - **Zigbee / Z-Wave:** Sehr energiesparende Funknetze (Mesh-Netzwerke), ideal für batteriebetriebene Sensoren.
  - **WLAN / Bluetooth:** Einfach einzurichten, verbraucht aber mehr Strom und belastet den Router bei vielen Geräten.

---

## Folie 8 — Kabelsysteme (Ideal für Neubau und Kernsanierung)

- **KNX** oder **Loxone:** Die stabilste, langlebigste, aber auch teuerste Variante, bei der grüne Bus-Kabel direkt in der Wand verlegt werden.

---

## Folie 9 — Kabelsysteme: Netzwerkkabel (Bildfolie)

![Foto eines aufgefächerten grünen Netzwerkkabels](images/img-009-002.png)

> **Beschreibung:** Foto eines einzelnen Kabels mit grüner Außenummantelung vor hellgrauem Hintergrund. Am oberen Ende sind die Adern aufgefächert: zwei verdrillte Paare (orange/weiß links, grün/weiß rechts) sowie eine einzelne orange und eine weiße Ader in der Mitte. Das Bild zeigt den inneren Aufbau eines verdrillten Adernkabels, lässt aber offen, welches konkrete Smart-Home-Protokoll dahintersteckt.

---

## Folie 10 — Kabelsysteme: Busleitung (Bildfolie)

![Produktfoto einer grünen EIB-Busleitung mit Abisolierbeispiel](images/img-010-003.png)

> **Beschreibung:** Produktfoto auf weißem Grund: Links liegt eine grüne Rolle Busleitung der Marke EBROM mit dem Etikett „EIB-Y(St) Y 2x2x0,8 mm“ und dem Aufdruck „Busleitung“ sowie CE-Zeichen. Rechts ist das Kabelende abisoliert: vier farbige Adern (schwarz, gelb, weiß, rot) unter einer silbernen Schirmung, daneben setzt eine Seitenschneide an. Das Bild zeigt ein Bus-Kabel für EIB-/KNX-Installationen (EIB ist der Vorläufer von KNX; Zuordnung aus dem Etikett abgeleitet).

---

## Folie 11 — Schaltschrank (Praxisbeispiel)

![Geöffneter Schaltschrank mit Verteilertechnik](images/img-011-004.png)

> **Beschreibung:** Foto eines geöffneten, weiß gerahmten Schaltschranks von vorn. Auf mehreren Hutschienen sind Sicherungsautomaten, Reihenklemmen, Netzteile und grüne Busmodule montiert, deren Kabel in blauen, schwarzen und grauen Bündeln verlegt sind. Oben rechts sitzen gelbe Netzwerkkabel und ein rotes Gerät, unten links ein Hauptschalter mit rotem Überspannungsschutz. Das Bild zeigt den strukturierten Aufbau einer Smart-Home-Verteilung im Detail.

## Folie 12 — Aufbau des Schaltschranks (Praxisbeispiel)

![Screenshot eines Instagram-Beitrags mit Foto eines Schaltschranks](images/img-012-005.png)

> **Beschreibung:** Screenshot eines Social-Media-Beitrags des Elektrobetriebs domhoeferelektrotechnik, links ein Foto eines in die Wand eingelassenen Schaltschranks mit KNX-Komponenten. Rechts steht der Begleittext, der den Aufbau vom leeren Verteiler bis zur fertigen Installation als Schritt-für-Schritt-Serie ankündigt. Die Abbildung dient als Beleg für eine reale KNX-Installation.

## Folie 13 — 3. Die Steuerungsebene: Das Gateway / Hub (Das Gehirn)

Die **Zentrale (auch Gateway, Bridge oder Hub genannt)** ist das Herzstück des Smart Homes. Sie übersetzt die Signale der verschiedenen Geräte und führt die automatischen Logiken aus.

- **Lokale Zentralen:** Systeme wie **Home Assistant** oder **ioBroker** laufen auf eigener Hardware (z. B. einem Raspberry Pi) im Haus. Ihre Daten bleiben lokal und funktionieren oft auch ohne Internet.
- **Cloud-Zentralen:** Systeme wie **Philips Hue Bridge** oder **Bosch Smart Home** senden Daten oft in eine Cloud, bieten dafür aber eine sehr einfache Plug-and-Play-Einrichtung.

## Folie 14 — 4. Die Unternehmensebene: Benutzerschnittstellen (Die Bedienung)

Hier interagiert der Mensch mit dem System. Das System läuft zwar im Idealfall vollautomatisch, kann aber jederzeit übersteuert werden durch:

- **Apps** auf dem Smartphone oder Tablet.
- **Sprachassistenten** (z. B. Apple Siri, Amazon Alexa, Google Assistant).
- **Klassische Taster** an der Wand, die digital umprogrammiert wurden (z. B. „Ein Klick = Licht an, Doppelklick = Alles aus im Raum").

## Folie 15 — Ablauf von Smart Home

| Stufe | Inhalt |
|---|---|
| 1. Geräte | Sensoren (Messen) & Aktoren (Schalten) |
| 2. Protokoll | Funk (Zigbee, Matter) oder Kabel (KNX) |
| 3. Zentrale | Smart Home Gateway / Hub (die „Zentrale") |
| 4. Steuerung | Smartphone, Sprachassistent, Wandschalter |

## Folie 16 — Beispiel für den Ablauf

![Vierstufiger Ablauf: Sensor, Protokoll, Zentrale, Aktor](images/pages/page-16.png)

> **Beschreibung:** Vektorgrafik mit vier nebeneinanderliegenden Pfeil-Kacheln in Türkis, Hellgrün, Rot und Blau, beschriftet mit „Sensor", „Protokoll", „Zentrale" und „Aktor". Darunter stehen jeweils erläuternde Textkästen, die einen Fenstersensor, Zigbee-Funk, das Smart-Home-Gehirn und einen Heizkörperthermostat beschreiben. Die Pfeilrichtung von links nach rechts zeigt den Informationsfluss vom Messen über die Übertragung und Logik bis zum Schalten.

| Stufe | Beispiel |
|---|---|
| Sensor (Schicht 1) | Der Fenstersensor registriert, dass das Fenster im Schlafzimmer geöffnet wird. |
| Protokoll (Schicht 2) | Er sendet diese Information via Zigbee-Funk an die Zentrale. |
| Zentrale (Schicht 3) | Das Smart-Home-Gehirn hat die Logik gespeichert: „Wenn Fenster offen, dann Heizung aus". Es sendet einen Befehl zurück. |
| Aktor (Schicht 1) | Das Heizkörperthermostat empfängt den Befehl und dreht das Ventil zu. |

## Folie 17 — Einfaches Python Script

![Python-Quelltext: Zufallstemperatur und Endlosschleife zur Heizungssteuerung](images/img-017-006.png)

> **Beschreibung:** Screenshot eines Quelltexts in dunklem Editor-Design mit farbiger Syntaxhervorhebung. Das Skript importiert `time` und `random`, definiert `messe_temperatur()` (liefert einen Zufallswert zwischen 18,0 und 22,0 °C) und `steuere_heizung(status)` (gibt ein Signal aus). Eine `while True`-Schleife prüft ab 20,0 °C „AUS", sonst „EIN" und wartet anschließend 60 Sekunden. Die Abbildung zeigt eine minimale, simulierte Steuerungslogik ohne echte Hardware.

## Folie 18 — Hysterese

Die **Hysterese** (auch Schalthysterese) bei einer Heizung ist der Temperaturbereich zwischen dem Ein- und Ausschaltpunkt des Wärmeerzeugers. [1, 2]

**Funktionsweise**

**Beispiel:** Ist die Solltemperatur auf **22 °C** eingestellt und die Hysterese beträgt **0,5 °C**:

- Die Heizung **schaltet ein**, wenn die Temperatur auf **21,5 °C** fällt.
- Die Heizung **schaltet ab**, wenn die Temperatur **22,5 °C** erreicht. [1]

**Zweck:** Sie verhindert das ständige, nervige An- und Ausschalten (das sogenannte „Takten" oder „Relais-Rattern") der Heizung bei winzigen Temperaturschwankungen.

## Folie 19 — Einfaches Python Script mit Hysterese

![Python-Quelltext mit Konfiguration von Soll-Temperatur und Hysterese](images/img-019-007.png)

> **Beschreibung:** Screenshot eines Python-Skripts im dunklen Editor-Design mit Syntaxfarben. Oben sind `SOLL_TEMPERATUR = 20.0` und `HYSTERESE = 0.5` konfiguriert, daraus werden `EINSCHALT_PUNKT` (19,5 °C) und `AUSSCHALT_PUNKT` (20,5 °C) berechnet. Der Startzustand `heizung_ist_an` ist `False`, und die Funktion `messe_temperatur()` ist als Platzhalter mit Rückgabewert 19,4 angelegt. Die Abbildung zeigt die Parameter, mit denen die Schaltschwellen festgelegt werden.

## Folie 20 — Die Scriptlogik (Pyton)

![Python-Quelltext der Hysterese-Regelungslogik mit Schleife](images/img-020-008.png)

> **Beschreibung:** Screenshot des Python-Quellcodes im dunklen Editor-Design mit farbig hervorgehobenen Schlüsselwörtern und Strings. Die `while True`-Schleife misst die Temperatur und prüft abhängig vom Zustand `heizung_ist_an`: Bei eingeschalteter Heizung wird sie erst ab dem Ausschaltpunkt abgeschaltet, bei ausgeschalteter erst unterhalb des Einschaltpunkts wieder eingeschaltet. Jede Aktion wird mit einer Statusmeldung ausgegeben, und danach wartet das Skript 60 Sekunden.

---

## Folie 21 — Beispiel: Automatisierung „Keller Bad"

![Tuya-App: Automatisierung „Keller Bad an" (links) und „Keller Bad aus" (rechts)](images/img-021-009.png)

> **Beschreibung:** Zwei Screenshots der Tuya-Smart-App mit der Automatisierungs-Ansicht. Links „Keller Bad an": Wenn eine Bedingung erfüllt ist, Feuchtigkeit größer als 80 %; dann Switch 1 ON für „Keller Bad" (als „Entfernt" markiert) und Switch 1 ON für „Technik | Keller Bad". Rechts „Keller Bad aus": Feuchtigkeit weniger als 77 %; dann Switch 1 OFF für beide Schalter. Gültigkeitsbereich ist „Ganztägig", die Option „Im Raum anzeigen" ist deaktiviert, unten jeweils der orangefarbene Button „Speichern".

![Tuya-App: Automatisierung „Keller Bad aus" mit Feuchtigkeit unter 77 %](images/img-021-010.png)

> **Beschreibung:** Zweiter Screenshot derselben Automatisierung, hier als Gegenstück zum Einschalten: Die Bedingung „Feuchtigkeit: weniger als 77 %" schaltet die beiden Schalter „Switch 1" wieder aus. Die Abstufung 80 % (an) und 77 % (aus) bildet eine Hysterese, damit das Gerät nicht bei einem Wert um die Schwelle ständig schaltet. Die Oberfläche entspricht dem Editor der Tuya-App mit Wenn-/Dann-Blöcken.

## Folie 22 — Vor und Nachteile der Smart Home Systeme

**Tuya:** Tuya stellt die Software-Infrastruktur für tausende White-Label-Hersteller (wie Lidl Livarno, Luminea, Nedis) bereit.
Die Steuerung erfolgt meist über die **Tuya Smart** oder **Smart Life App**.

**Vorteile:**

- **Riesige Produktauswahl:** Es gibt extrem viele, sehr günstige Geräte (Leuchtmittel, Stecker, Kameras).
- **Einfacher Einstieg:** Viele Tuya-Geräte nutzen einfaches WLAN – man benötigt oft keine teure separate Zentrale (Bridge/Hub).
- **Gute App-Funktionen:** Die Apps bieten umfangreiche Automatisierungsmöglichkeiten und Szenen.

## Folie 23 — Tuya: Nachteile

**Nachteile:**

- **Cloud-Zwang:** Fällt das Internet oder die Tuya-Cloud aus, funktionieren viele Routinen und die Fernsteuerung nicht mehr.
- **Datenschutz:** Da es sich um eine globale Cloud-Plattform handelt, wandern Nutzungsdaten über externe Server.
- **WLAN-Überlastung:** Viele günstige Tuya-WLAN-Geräte können den heimischen Router schnell überlasten.

## Folie 24 — Zigbee

Zigbee ist ein etablierter, energiesparender Funkstandard für Smart-Homes, der unter anderem von Philips Hue, IKEA Home smart und Aqara genutzt wird.

**Vorteile:**

- **Lokaler Betrieb:** Befehle werden direkt im Haus verarbeitet. Das System funktioniert extrem schnell und ist komplett unabhängig vom Internet.
- **Mesh-Netzwerk:** Jedes dauerhaft am Strom hängende Zigbee-Gerät (z. B. eine Lampe) wirkt als Signalverstärker. Das erhöht die Reichweite enorm.
- **Extrem energiesparend:** Batteriebetriebene Sensoren und Schalter halten oft jahrelang mit einer Knopfzelle.

## Folie 25 — Zigbee: Nachteile

**Nachteile:**

- **Hub/Zentrale erforderlich:** Man benötigt zwingend ein Gateway (z. B. Philips Hue Bridge oder einen universellen Zigbee-USB-Stick).
- **Kompatibilitäts-Inseln:** Obwohl alle „Zigbee" nutzen, lassen sich Geräte verschiedener Hersteller nicht immer ohne Weiteres an derselben Zentrale anlernen.

## Folie 26 — Matter

Matter ist der neueste, vom Branchenkonsortium (Apple, Google, Amazon, Samsung u. a.) entwickelte Standard. Er soll die Fragmentierung des Smart-Homes endgültig beenden. Matter nutzt als Transportwege bestehendes WLAN oder das moderne, energiesparende **Thread**-Funknetzwerk.

## Folie 27 — Matter: Vorteile

**Vorteile:**

- **Herstellerübergreifend:** Ein Matter-Gerät funktioniert garantiert mit Apple Home, Google Home, Amazon Alexa und Samsung SmartThings gleichzeitig („Multi-Admin").
- **Zukunftssicher und lokal:** Matter steuert Geräte komplett lokal im Heimnetzwerk – für maximale Geschwindigkeit und Ausfallsicherheit ohne Cloud-Zwang.
- **Hohe Sicherheit:** Der Standard setzt auf moderne Verschlüsselungs- und Sicherheitsmechanismen bei der Geräte-Inbetriebnahme.

## Folie 28 — Matter: Nachteile

**Nachteile:**

- **Noch in der Entwicklung:** Der Standard deckt noch nicht alle Geräteklassen (z. B. komplexe Kameras oder Spezial-Sensoren) perfekt ab. Updates der Hersteller verzögern sich oft.
- **Hardware-Anforderungen:** Für Thread-basierte Matter-Geräte wird ein kompatibler „Thread Border Router" benötigt (z. B. ein neuerer Apple HomePod, Google Nest Hub oder Amazon Echo).
- **Höherer Preis:** Matter-zertifizierte Hardware ist aktuell meist teurer als einfache Tuya- oder reine Zigbee-Komponenten.

## Folie 29 — Die drei Kommunikationswege

**Der Standard-Weg (WLAN-Geräte):**

Smartphone App → *Internet* → **Tuya Cloud** → *Internet/Router* → **Tuya WLAN-Gerät**

**Der Brücken-Weg (Zigbee/Bluetooth-Geräte):**

Smartphone App → *Internet* → **Tuya Cloud** → *Internet* → **Tuya Zigbee Gateway** → *Lokaler Funk* → **Zigbee-Sensor**

**Der Drittanbieter-Weg (Sprachassistenten):**

**Sprachbefehl** („Alexa...") → **Amazon/Google Cloud** → *Cloud-to-Cloud Kopplung* → **Tuya Cloud** → **Endgerät**

## Folie 30 — Tuya System-Architektur & Kommunikationswege

![Diagramm „Tuya System-Architektur & Kommunikationswege" mit Tuya Cloud als zentralem Knoten](images/img-030-015.png)

> **Beschreibung:** Netzwerkdiagramm mit Kästen und Pfeilen. Oben in Blau der „Zentrale Knoten Tuya Cloud", darunter links die grüne „Smartphone App (Smart Life / Tuya)", rechts die violette „Sprachassistenten (Alexa / Google)". Alle drei Verbindungen zur Cloud sind rot und doppelt gezeichnet (HTTPS/MQTT bzw. Cloud-to-Cloud API). Eine gestrichelte Linie trennt oben „WAN / Internet (Cloud-Abhängig)" vom unteren Bereich „Lokales Netzwerk (LAN / WPAN)". Darunter die orange „Tuya WLAN Geräte" (direkte IP-Verbindung per MQTT über das Internet) und das pinke „Tuya Zigbee Gateway", das über einen grünen Pfeil „Lokaler Zigbee-Funk" mit dem gelben „Tuya Zigbee Endgerät" verbunden ist.
> Im Kasten unten links steht die Erkenntnis: Alle primären Wege laufen über die Tuya Cloud; ohne Internet verlieren App und WLAN-Geräte die Verbindung; nur Gateway zu Zigbee-Endgerät ist rein lokal.

---

## Folie 31 — Der entscheidende Vorteil: lokale Datenverarbeitung

**Der entscheidende Vorteil:** Dieser gesamte Datenverkehr verlässt niemals dein Haus. Selbst wenn dein Internetanbieter eine Störung hat oder dein Router komplett vom Strom getrennt wird, funktioniert dieser Funkgraph autark weiter.

## Folie 32 — Zigbee-Architektur & Lokaler Kommunikationsgraph

![Zigbee-Architektur mit lokalem Kommunikationsgraph](images/img-032-016.png)

> **Beschreibung:** Netzwerkdiagramm mit farbigen Rechtecken und Pfeilen. Oben verbinden eine blaue Smartphone-App (Steuerung) und ein grünes lokales IP-Netzwerk (WLAN/LAN) bidirektional sowie per IP-Verbindung mit einer orangen Zigbee-Zentrale (Coordinator / Bridge). Darunter liegt ein gestricheltes Rechteck „Lokales Mesh-Netzwerk (Kein Internet nötig)“, in dem die Zentrale per grünen Zigbee-Funk-Pfeilen mit zwei violetten Routern verbunden ist: Router 1 (Dauerstrom / Lampe) und Router 2 (Dauerstrom / Steckdose). Zwischen beiden Routern zeigt eine orange Linie den „Mesh-Link“, und ein Pfeil „Energiearm“ führt zum roten Zigbee-Endgerät (Batterie-Sensor).

## Folie 33 — Der Matter-Controller (Die Steuerzentrale)

**Der Matter-Controller (Die Steuerzentrale):**

**Funktion:** Das Gehirn, das die Geräte steuert, Automatisierungen ausführt und die Schnittstelle zu deiner App bildet. Beispiele sind ein Apple TV 4K, ein Google Nest Hub oder ein Amazon Echo.

**Besonderheit („Multi-Admin“):** Ein Matter-Netzwerk kann **mehrere Controller gleichzeitig** haben. Du kannst ein und dieselbe Matter-Lampe parallel über Apple Home (auf dem iPad) und Google Home (auf einem Android-Tablet) steuern. Die Controller synchronisieren den Gerätestatus direkt lokal untereinander.

## Folie 34 — Der Thread Border Router (Die Funk-Brücke)

**Der Thread Border Router (Die Funk-Brücke):**

**Funktion:** Viele moderne, kleine Matter-Geräte funken nicht über das stromhungrige WLAN, sondern über das effiziente **Thread**-Funknetzwerk. Der *Thread Border Router* verbindet das Thread-Netzwerk nahtlos mit deinem normalen Heimnetzwerk (WLAN/LAN). Oft ist diese Funktion direkt in den Matter-Controller (z. B. im Apple TV oder Nest Hub) eingebaut.

## Folie 35 — Die Matter-Endgeräte (WLAN oder Thread)

**Die Matter-Endgeräte (WLAN oder Thread):**

**Matter-über-WLAN:** Größere Geräte, die viel Strom verbrauchen oder permanent am Netz hängen (z. B. smarte Steckdosen, smarte Haushaltsgeräte), nutzen dein normales WLAN. Sie sprechen Matter direkt über deinen Router.

**Matter-über-Thread (Router & Endpoints):** Stromsparende Geräte (Lampen, Sensoren) bauen untereinander ein stabiles **Thread-Mesh-Netzwerk** auf – ähnlich wie bei Zigbee. Lampen leiten Signale weiter (Router), während Batterie-Sensoren nur senden, wenn sich etwas ändert (Endpoints).

## Folie 36 — Ablauf eines typischen Schaltbefehls

Da Matter auf der gleichen IP-Technologie (Internet Protocol) wie dein Computer oder Smartphone basiert, sprechen alle Geräte „dieselbe Sprache“ – egal ob sie per Kabel, WLAN oder Thread verbunden sind. Ein typischer Schaltbefehl läuft so ab:

**Smartphone App (z. B. Apple Home)**

→ *(Lokales WLAN)* → **Matter Controller / Thread Border Router** → *(Lokaler Thread-Funk)* → **Thread-Router (Lampe im Wohnzimmer)** → *(Lokaler Thread-Funk)* → **Matter-Heizkörperthermostat**

## Folie 37 — Der entscheidende Vorteil: lokale Kommunikation

**Der entscheidende Vorteil:** Wie bei Zigbee bleibt die gesamte Kommunikation **zu 100 % lokal** in deinem Haus. Es ist keine Cloud-Verbindung für die Schaltung notwendig. Gleichzeitig entfällt das Problem von Zigbee, dass Geräte verschiedener Hersteller (z. B. Hue und Aqara) separate Bridges benötigen – bei Matter fließen alle Daten nahtlos durch dieselbe lokale Netzwerkstruktur.

## Folie 38 — Gefahren und Fallstricke von Cloudanbietern

![Vergleichstabelle Serverstandort: Deutschland/EU vs. Drittländer (z. B. USA)](images/img-038-017.png)

> **Beschreibung:** Screenshot einer dunklen Tabelle mit dem Titel „Warum der Serverstandort wichtig, aber nicht alles ist“. Die Tabelle vergleicht die Kriterien „Drittlandtransfer“, „Rechtlicher Zugriff“ und „Herausforderung“ für Server in Deutschland/EU und Server in Drittländern (z. B. USA). Für Deutschland/EU steht dort „Nein“ bzw. kein Transferrisiko im Sinne der Art. 44 ff. DSGVO, für Drittländer „Ja“ mit Absicherungspflicht (z. B. EU-US Data Privacy Framework oder Standardvertragsklauseln). Beim Hosting bei US-Anbietern mit Servern in Frankfurt bleibt laut Tabelle das CLOUD-Act-Risiko über den Mutterkonzern bestehen.

## Folie 39 — Datenschutz: Hosting von Daten in China

Das Hosten von personenbezogenen Daten auf einem Server in China ist nach der DSGVO **rechtlich extrem riskant** und in den allermeisten Fällen **unzulässig**.

Da China aus Sicht der EU als unsicheres Drittland gilt und kein Angemessenheitsbeschluss der EU-Kommission vorliegt, müssen für einen solchen Datentransfer extrem strenge Hürden genommen werden. In der Praxis scheitern DSGVO-konforme Lösungen meist an den weitreichenden staatlichen Überwachungsgesetzen in China.

## Folie 40 — Kein Angemessenheitsbeschluss (China)

**1) Kein Angemessenheitsbeschluss:** Die Europäische Kommission stuft das Datenschutzniveau in China nicht als gleichwertig mit dem europäischen Standard ein.

---

## Folie 41 — Zugriffsrisiko durch Behörden

**2) Zugriffsrisiko durch Behörden (Geheimdienstgesetz):**
Selbst wenn Sie Verträge mit einem Cloud-Anbieter in China abschließen, verpflichtet Artikel 7 des chinesischen Geheimdienstgesetzes dortige Organisationen und Unternehmen zur Kooperation mit den staatlichen Sicherheitsbehörden. Ein wirksamer Schutz vor staatlichem Zugriff ist damit kaum zu garantiere

## Folie 42 — Scheitern von Standardvertragsklauseln

**3) Scheitern von Standardvertragsklauseln (SCCs):** Zwar können Unternehmen theoretisch Standardvertragsklauseln (SCC) vereinbaren. Im Rahmen des zwingend erforderlichen *Transfer Impact Assessments (TIA)* muss jedoch geprüft werden, ob das Recht des Drittlandes die Einhaltung der SCCs aushebelt. Wegen der chinesischen Überwachungsgesetze kommen deutsche Aufsichtsbehörden hier fast immer zu einem negativen Ergebnis.

## Folie 43 — KI-Modelle & APIs

**KI-Modelle & APIs:**
Prominente Fälle wie der chinesische Chatbot DeepSeek oder die Modelle von Moonshot AI (Kimi K3) dürfen mit personenbezogenen Daten europäischer Nutzer in Unternehmen **nicht direkt in der Cloud-Variante** genutzt werden, da die Daten auf Servern in der Volksrepublik China landen. Hier wird stattdessen die Nutzung von Open-Source-Modellen auf *lokalen, selbst gehosteten Servern (self-hosted)* in Europa empfohlen.

## Folie 44 — Social Media

**Social Media:** Gegen Plattformen wie TikTok wurden bereits massive DSGVO-Verfahren und Bußgelder durch europäische Behörden (wie der irischen DPC) eingeleitet, weil europäische Nutzerdaten auf Servern in China gespeichert oder dorthin übertragen wurden.

## Folie 45 — Echte Anonymisierung

**Echte Anonymisierung:** Wenn die Daten auf dem Server in China absolut keinen Personenbezug mehr aufweisen (und auch nicht wieder identifiziert werden können), greift die DSGVO nicht.

## Folie 46 — Gibt es deutsche Anbieter?

*Gibt es deutsche Anbieter?*

**KLAR!**

## Folie 47 — Vorteil: DSGVO-konform

**Vorteil:**

![DSGVO-konform-Siegel](images/img-047-018.png)

> **Beschreibung:** Rundes Siegel mit dunkelblauem Außenring, auf dem zwölf gelbe Sterne im Kreis angeordnet sind (EU-Symbolik). Im hellen, silbrig glänzenden Innenkreis steht in großer dunkelblauer Schrift „DSGVO“, darunter in gesperrtem Großbuchstabensatz „KONFORM“. Die Grafik ist ein reines Logo-/Badge-Motiv und soll die DSGVO-Konformität des Anbieters als Vorteil visualisieren.

## Folie 48 — Smart-Home-Systeme

![AVM FRITZ! Smart Home App auf Smartphone](images/img-048-020.png)

> **Beschreibung:** Blauer Hintergrund mit gelb-rotem FRITZ!-Logo auf einem Kreis mit Hausschalter-Symbol links. Rechts ist ein Smartphone mit der Oberfläche „Smart Home“ zu sehen, die Raumkacheln wie Wohnzimmer (24,5 °C), Schlafzimmer (26,0 °C) und Deckenlicht Flur (AUS) sowie DECT-Steckdosen zeigt. Die Abbildung steht für das Smart-Home-System AVM FRITZ!.

![tado Smart-Thermostat-Set](images/img-048-021.png)

> **Beschreibung:** Produktbild mit weißem tado°-Logo auf weißem Grund und blauem Keil. Zu sehen sind eine weiße quadratische Bridge mit WPS-Taste, die in die Steckdose gesteckt wird, sowie ein Heizkörperthermostat-Kopf mit Display, das 20,0° und 19,5° anzeigt. Die Markierung „6X“ weist auf ein Set mit sechs Thermostaten hin.

![Homematic IP Einfamilienhaus mit Kategorien](images/img-048-022.png)

> **Beschreibung:** Fotorealistische Darstellung eines Einfamilienhauses mit Solaranlage, Garage und Garten, dessen Bereiche über blaue Beschriftungsfelder markiert sind. Die Felder lauten „Raumklima“, „Licht & Schatten“, „Wetter & Umwelt“ und „Sicherheit & Alarm“, jeweils mit einem kleinen Symbol. Das Bild zeigt, welche Funktionsbereiche das System Homematic IP abdeckt.

![homee-Logo](images/img-048-023.png)

> **Beschreibung:** Schwarzes Logo mit stilisiertem Wolken-und-Dach-Symbol über dem Schriftzug „homee“ in Kleinbuchstaben. Die Grafik ist ein reines Markenlogo ohne weitere Elemente. Sie steht für den Smart-Home-Anbieter homee.

## Folie 49 — Wichtiger deutscher Anbieter

Einer der für uns wichtigsten deutschen Anbieter:

![wibutler-Logo](images/img-049-025.png)

> **Beschreibung:** Schwarzes Logo mit stilisiertem Doppel-Dreieck-Symbol (Schleife) links und dem Schriftzug „wibutler“ rechts, auf neutralem Hintergrund. Die Abbildung ist ein reines Markenlogo ohne Daten oder Achsen. Sie kennzeichnet den Anbieter wibutler als einen der wichtigsten deutschen Partner.

## Folie 50 — Partner von wibutler

![Partnerübersicht wibutler mit Herstellerlogos](images/img-050-027.png)

> **Beschreibung:** Weißes Raster mit oben mittig dem wibutler-Logo und darunter etwa 40 Herstellerlogos in sieben Spalten und fünf Reihen. Zu den erkennbaren Marken gehören unter anderem Daikin, Busch-Jaeger, Grundfos, Kemper, Viessmann, Zehnder, Solvis, Tece und Wilo. Die Übersicht zeigt das Partnernetzwerk von wibutler im Bereich Gebäudetechnik und Smart Home.

---

## Folie 51 — Bosch Smart Home

![Bosch Smart Home App-Icon](images/img-051-028.png)

> **Beschreibung:** Quadratisches App-Icon mit blauem Verlauf (heller oben, dunkler unten) und einem weißen, abgerundeten Rahmensymbol mit Haus-Piktogramm. Im unteren weißen Feld steht das rote BOSCH-Logo neben einem grauen Bosch-Kreiszeichen. Das Bild dient als Titelmotiv der Smart-Home-Lösung und enthält keine Daten.

## Folie 52 — Xiaomi Home App

![Xiaomi Home Startseite](images/img-052-032.png)

> **Beschreibung:** Screenshot der Startseite der Xiaomi-Home-App im Hochformat mit Reitern Favoriten, Wohnzimmer und Schlafzimmer. Die Kachelansicht zeigt eine Wetterkachel (9 °C, Luftqualität "Ausgezeichnet") sowie Schalter für Lampe, Panasonic, Silke, Nils, PC und Waschküche, aktive Schalter sind grün markiert. Oben steht ein Halloween-Werbebanner.

![Xiaomi Home Geräteliste](images/img-052-033.png)

> **Beschreibung:** Screenshot der Geräteliste "Winkelstraße" mit zwei Kacheln: Xiaomi Elektrorollladen 5 Max (Außenbereich) und Xiaomi Roboterstaubsauger (Schlafzimmer, "Laden beendet"). Unten sitzt die Navigationsleiste mit den Punkten Xiaomi Home, Automatisierung, Store und Profil. Die Oberfläche ist dunkel gehalten.

![Xiaomi Roboterstaubsauger Kartenansicht](images/img-052-034.png)

> **Beschreibung:** Screenshot der Statusansicht des Roboterstaubsaugers X10+ mit Reinigungskarte der Wohnung in farbigen Raumbereichen (Blau, Gelb, Orange, Türkis) und weißen Fahrlinien. Oben stehen die Werte Reinigungsfläche 33 m², Reinigungsdauer 44 Min. und ein Batteriebalken, darunter die Schaltflächen "Voll aufladen" und "Start". Der Hintergrund ist schwarz.

## Folie 53 — Google Home

![Google Home Startseite](images/img-053-035.png)

> **Beschreibung:** Screenshot der dunklen Google-Home-Startseite mit braunen Gerätekacheln für Büro, Makita (an), PC (an) sowie als offline markierte Geräte Spiegel und Anker. Unten befindet sich die Navigation mit Startseite, Aktivität und Automat. Offline-Geräte sind grau und mit Warnsymbol dargestellt.

![Google Home Klima-Ansicht](images/img-053-036.png)

> **Beschreibung:** Screenshot der Klimaansicht mit Ofen-Regler (Soll 18, Innen 21) sowie den Kacheln Ventilator (an), Keller Bad (18,1 °C) und Waschküche (15,9 °C). Oben werden 8 °C für Leopoldshöhe und ein Luftqualitätswert von 30 (AQI "Gut") angezeigt. Der Stil ist durchgehend braun-dunkel.

## Folie 54 — Heizkreis-Steuerung

![Bosch Heizung Überblick](images/img-054-037.png)

> **Beschreibung:** Screenshot der Überblicksseite mit Außentemperatur 8 °C und Ortsangabe Leopoldshöhe. Darunter stehen drei Kacheln: Heizkreis (Status "Heizen", Betriebsart Auto), Warmwasser (51 °) und Energiemonitoring. Die Struktur zeigt die Geräteebenen einer Wärmeerzeuger-Anlage.

![Heizkreis Solltemperatur](images/img-054-038.png)

> **Beschreibung:** Screenshot der Heizkreis-Detailansicht mit einem halbkreisförmigen Drehregler (Skala OFF bis 30°), der auf 21° steht. Darunter zeigt eine 24-Stunden-Zeitleiste rote Balken für Nacht (Mond) und Tag (Sonne). Die Betriebsart ist mit "Auto" angegeben.

![Heizkreis Zeitprogramm B](images/img-054-039.png)

> **Beschreibung:** Screenshot des Zeitprogramms B mit einer Zeile je Wochentag von Montag bis Sonntag. Jede Zeile besteht aus einem Nachtabschnitt (dunkelrot, Mond) und einem Tagabschnitt (rot, Sonne) über 24 Stunden. Donnerstag ist rot hervorgehoben, Samstag und Sonntag weichen im Nachtabschnitt ab.

## Folie 55 — Energiemonitoring

![Energiemonitoring Heute](images/img-055-040.png)

> **Beschreibung:** Screenshot des Energiemonitorings mit Reiter "Heute" und Gesamtwert 38,9 kWh. Ein vollständig magentafarbener Ring (100 %) steht für das Gas-Brennwertgerät, darunter ist derselbe Wert angegeben. Unten befindet sich die Schaltfläche "Detailansicht".

![Energiemonitoring Diesen Monat](images/img-055-041.png)

> **Beschreibung:** Screenshot mit Reiter "Diesen Monat" und Gesamtwert 451,1 kWh. Der Kreis ist wie auf der Heute-Ansicht vollständig magentafarben (100 %) und dem Gas-Brennwertgerät zugeordnet. Der Aufbau entspricht der Tagesansicht.

![Energiemonitoring Dieses Jahr](images/img-055-042.png)

> **Beschreibung:** Screenshot mit Reiter "Dieses Jahr" und Gesamtwert 11311 kWh. Der magentafarbene Ring ist vollständig gefüllt (100 %) und das Gas-Brennwertgerät trägt denselben Wert. Die Ansicht dient dem Vergleich der Zeiträume.

## Folie 56 — Energiemonitoring: Jahresverlauf

![Energiemonitoring Jahresdiagramm 2026](images/img-056-043.png)

> **Beschreibung:** Kombiniertes Diagramm mit magentafarbenen Säulen für den Gasverbrauch in kWh von Januar bis Oktober 2026 (linke Achse 0 bis 4.000 kWh). Die Säulen fallen von rund 3.800 kWh im Januar auf unter 300 kWh im Sommer und steigen im Oktober wieder leicht auf 431,1 kWh (Werte grob abgelesen). Zwei Linien auf der rechten Achse in °C zeigen eine obere, nahezu konstante Linie um 50 °C (unbeschriftet) und eine untere, im Jahresverlauf steigende Außentemperatur-Linie. Im rechten Panel stehen die Summe für Oktober, die Außentemperatur von 11,9 °C und die Raumtemperatur.

## Folie 57 — Wärmeerzeuger und Anlagen-Monitoring

![Wärmeerzeuger Menü](images/img-057-045.png)

> **Beschreibung:** Screenshot des Menüs "Wärmeerzeuger" mit Gerätebild (Thermostat und Heizgerät) und gegliederten Menüpunkten. Die Gruppen sind Anlagen-Informationen (Anlagen-Monitoring, Konnektivitätsinformationen), Konfigurationen (Urlaubszeiten, Temperatureinstellungen, Systemmodus) und Geräteverwaltung (Datum und Uhrzeit, Servicepartner, Gerät entfernen in Rot). Der Aufbau ist eine einfache Listenansicht mit Pfeilen.

![Anlagen-Monitoring Werte](images/img-057-046.png)

> **Beschreibung:** Screenshot der Liste "Anlagen-Monitoring" mit Messwerten in zwei Blöcken: Allgemeines (Außentemperatur 8,9 °, Vorlauf 26,2 °, Rücklauf 28 °, Betriebsstunden 23829, Anzahl der Starts 348796) und Heizkreis 1 (Systemstatus Heizen, Betriebsart Auto, Wunschtemperatur 21 °). Am unteren Rand beginnt der Block Warmwasser mit einer Speichertemperatur von 51,1 °. Die Darstellung ist tabellarisch mit Werten rechtsbündig.

## Folie 58 — tado° App

![tado Startseite](images/img-058-047.png)

> **Beschreibung:** Screenshot der tado°-Startseite mit Schaltflächen "Zu Away wechseln" und "Ausschalten Alle Räume" oben. Kacheln zeigen Wohnzimmer (20,9 °, eingestellt auf 18 °, Luftfeuchte 57 %), AI Assist, Raumluft-Komfort, HOME Geofencing, Energy IQ und einen Strompreis von 19,9 ct. Dunkler Hintergrund mit grünen und blauen Akzenten.

![tado Wohnzimmer-Regler](images/img-058-048.png)

> **Beschreibung:** Screenshot der Wohnzimmer-Detailansicht mit Ist-Temperatur 20,9 °, Luftfeuchtigkeit 57 % und Solltemperatur 18,0 °. Den Mittelpunkt bildet ein vertikaler Schieberegler, dessen unterer Teil hell und dessen oberer Teil dunkel gefüllt ist. Unten steht der Hinweis "Danach: 20,0° am 23. Okt., 07:00".

![tado Raumluft-Komfort](images/img-058-049.png)

> **Beschreibung:** Screenshot der Raumluft-Komfort-Ansicht mit Kachel "Frischluft-Indikator" (Haus-Illustration, Hinweis "RAUMLUFT MÄSSIG", keine offenen Fenster in den letzten 15 Stunden, Datenquelle OpenWeather). Darunter zeigt die Kachel "Wohnzimmer: AUSGEWOGEN" ein Kreisdiagramm mit den Achsen ZU WARM, TROCKEN, FEUCHT und KALT. Temperatur 20,0° und Luftfeuchtigkeit 57 % sind als Kennzahlen unten angegeben.

## Folie 59 — Kamera Hauseingang

![Kamerabild Hauseingang](images/img-059-050.png)

> **Beschreibung:** Standbild einer Überwachungskamera mit Blick auf einen Hauseingang: links eine dunkelbraune Haustür, rechts eine weiße Tür mit Briefkasten und Außenlampe, dazwischen eine Backsteinwand mit Blumentöpfen und einer Treppe mit Metallgeländer. Oben im Bild sind zwei dunkle Flugobjekte (vermutlich Vögel) zu sehen. Die eingeblendete Zeitangabe lautet 2025-05-21 09:29:12.

## Folie 60 — Home Assistant

Da es eine Fülle an verschiedenen Protokollen auf dem Markt gibt, die nicht miteinander kommunizieren, macht es Sinn eine Software und Server zu wählen, die die verschiedenen Dienste und Anbieter vereinen.

![Home Assistant Banner](images/img-060-051.png)

> **Beschreibung:** Werbebanner in Hellblau mit einem Muster aus weißen Smart-Home-Symbolen (Schalter, Steckdose, Haus, Lampe, Sensor). Im Vordergrund stehen das weiße Home-Assistant-Logo mit Haus-Icon und der Schriftzug "Home Assistant". Das Bild ist ein Markenmotiv und enthält keine Messwerte.

Home Assistent ist ein dafür ein Beispiel

---

## Folie 61 — Dashboards & Automationen

- Smarte Automationen: Komplexe Bedingungen (z.B. Zeit, Anwesenheit, Helligkeit) verknüpfen
- Individuelle Dashboards: Vollständig anpassbare Oberflächen für Handys, Tablets oder Wanddisplays
- Integriertes Energiedashboard: Live-Überwachung von Stromverbrauch, PV-Anlage und Gas
- Lokale Sprachsteuerung: Private Sprachassistenten ganz ohne Amazon oder Google Clouds

## Folie 62 — Home Assistant: Grundprinzipien (ohne Überschrift)

- Open-Source-Software für die Hausautomatisierung
- Lokaler Fokus: Läuft autark ohne zwingende Cloudanbindung
- Herstellerunabhängig: Vereint Zigbee, Matter, Z-Wave, WLAN & Co.
- Hoher Datenschutz: Sensordaten und Kamerastreams bleiben im Haus

## Folie 63 — Hardware für Home Assistant OS

Home Assistant OS ist ein eigenständiges Linux Betriebssystem auf einem lokalen Server. Es hat nur geringe Anforderung an Hardware.

- **Einplatinencomputer:** Sehr beliebt auf dem Raspberry Pi 4 oder 5.
- **Mini-PCs:** x86-Plattformen wie ein Intel NUC oder gebrauchte Office-PCs (Thin Clients), die mehr Leistung bieten.
- **Fertigsysteme:** Hauseigene Hardware wie der *Home Assistant Green* oder *Yellow*.
- **Virtuelle Maschinen (VM):** Für fortgeschrittene Nutzer läuft HAOS auch hervorragend als VM auf Server-Systemen wie Proxmox

![Raspberry Pi als Einplatinencomputer mit Gehäuse, Netzteil und Kühlkörpern](images/img-063-052.png)

> **Beschreibung:** Freigestellte Produktfotos auf schwarzem Hintergrund zeigen einen Raspberry-Pi-Einplatinencomputer (grüne Platine mit Anschlüssen) neben Netzteil, weißen Kühlkörpern und einem Pi-Logo-Aufkleber. Rechts ist ein Gehäuse in explodierter Darstellung zu sehen: schwarzer Deckel, grau-weiße Basis und ein Lüfter. Das Bild veranschaulicht die Einplatinencomputer-Option als Hardwarebasis für Home Assistant OS.

![Server-Umgebung mit Serverracks, NAS, Switch und Laptop mit Proxmox](images/img-063-054.png)

> **Beschreibung:** Fotorealistische Szene in einem Heimlabor mit Serverracks mit blau leuchtenden LED-Streifen im Hintergrund. Auf einem Holztisch stehen ein NAS-Gerät, ein Netzwerk-Switch, ein Laptop mit dem Schriftzug „PROXMOX Virtual Environment“, ein Notizblock und eine Kaffeetasse. Das Bild steht für den Betrieb von Home Assistant OS als virtuelle Maschine auf einem Server.

## Folie 64 — Unterschied zu anderen Varianten (z.B. Docker / Core)

Während du bei einer reinen Docker-Installation (Home Assistant Container) das Linux-Betriebssystem und alle Updates selbst über die Kommandozeile verwalten musst, nimmt HAOS dir diese Arbeit komplett ab. Dafür ist das System bei HAOS "abgeriegelt" – du kannst darauf keine anderen, Smart-Home-fremden Programme installieren.

## Folie 65 — Integrationen (Screenshot)

![Screenshot der Home-Assistant-Integrationsseite mit Kategorien und Logo-Raster](images/img-065-055.png)

> **Beschreibung:** Screenshot der Website von Home Assistant mit dem Titel „Integrations – devices and services that work with Home Assistant“. Links steht eine vertikale Kategorienliste (z.B. Climate, Energy, Lighting, Security), rechts ein Raster mit Logos unterstützter Systeme wie ESPHome, Google Cast, HomeKit Bridge, IKEA TRÅDFRI, KNX, Matter, MQTT, Philips Hue, Shelly, SmartThings, Sonos, Z-Wave und Zigbee Home Automation. Die Darstellung in Weiß mit blauen Akzenten zeigt die Herstellerunabhängigkeit der Plattform.

## Folie 66 — Dashboard (Screenshot)

![Screenshot eines Home-Assistant-Dashboards mit Beleuchtung, Thermostat und Medienkarten](images/img-066-056.png)

> **Beschreibung:** Screenshot des Home-Assistant-Dashboards („Übersicht“) in einem Browserfenster mit blauer Kopfleiste. Die Kartenstruktur zeigt Beleuchtung mit Schaltern (Kitchen Lights und Living Room Lights eingeschaltet), einen Thermostat mit 22 °C und Zieltemperaturbereich, eine Sicherheitskarte mit Buttons zum Aktivieren, eine Unterhaltungskarte (Harmony, Fernseher), einen Grundriss sowie ein Medien-Widget und Pendelinformationen. Das Bild verdeutlicht die frei gestaltbaren Kartenoberflächen.

## Folie 67 — Home Assistant auf Smartphone und Smartwatch

![Smartphone mit Home-Assistant-App neben einer Smartwatch auf einem Holztisch](images/img-067-057.png)

> **Beschreibung:** Fotografie auf einem warm beleuchteten Holztisch mit einem Smartphone im Vordergrund, auf dem die Home-Assistant-App mit Kacheln für Licht, Temperaturen (21,3 °C und 20,0 °C) und Kamera-Vorschauen zu sehen ist. Daneben steht eine Smartwatch mit der Uhrzeit 10:58 und Aktivitätsringen, im Hintergrund ist ein unscharfer Laptop zu erkennen. Einige Beschriftungen auf dem Display sind verzerrt und schlecht lesbar. Das Bild zeigt die mobile Nutzung der Steuerung auf Handy und Uhr.

## Folie 68 — Wanddisplay / Tablet-Dashboard

![Tablet mit Home-Assistant-Dashboard für Wohnzimmer, Küche, Schlafzimmer und Nutzung](images/img-068-058.png)

> **Beschreibung:** Foto eines auf einem Holztisch liegenden Tablets mit einem Dashboard, das nach Räumen gegliedert ist: Living room (30,8 °C, 71 % Luftfeuchte, Medienwidget), Kitchen und Vacuum mit Raumgrundriss und Ladestatus, Bedroom mit Klimaanlage (25 °C) und Lampen sowie eine Utility-Sektion. Darunter sind Kursinformationen (NASDAQ 100, Bitcoin) und Download-/Upload-Geschwindigkeiten (48,82 bzw. 50,02 Mbit/s) angezeigt. Das Bild steht für ein fest installiertes Wanddisplay mit individuellen Räumen und Statusinformationen.

## Folie 69 — Fazit (ohne Überschrift)

Home Assistant bietet maximale Freiheit, absolute Datensicherheit und wächst flexibel mit jedem Projekt – vom Einsteiger bis zum Experten.

## Folie 70 — (ohne Titel, leer)

_Keine Textinhalte; nur Foliennummer und Fußzeile._

---

## Folie 71 — (ohne Titel)

Leerfolie, nur Hintergrund und Fußzeile.

## Folie 72 — Aufgabe

Einfamilienhaus Baujahr ~1960 wird saniert.

1. Welche Nachrüstung ist möglich?
2. Welcher Übertragungsweg?
3. Welche Smarthome Komponenten machen in euren Augen Sinn

## Folie 73 — Kernsanierung als Chance

Bei einer **Kernsanierung** hast du die einmalige Chance, Smart-Home-Komponenten direkt unter Putz zu verlegen und auf eine kabelgebundene, zukunftssichere Basis zu setzen. Das spart später teure Batteriewechsel, verhindert Funklöcher und steigert den Wiederverkaufswert deiner Immobilie massiv.

Hier ist eine Übersicht der Komponenten, die bei einer Kernsanierung den größten Sinn ergeben, aufgeteilt nach Gewerken.

## Folie 74 — Infrastruktur (Das Fundament)

**1. Die Infrastruktur (Das Fundament)**

- **Bus-System (KNX oder Loxone):** Da die Wände ohnehin offen sind, solltest du grüne KNX-Busleitungen zu allen Schaltern, Sensoren und Präsenzmeldern legen. Dies ist der weltweite Standard für kabelgebundenes Smart Home. Es läuft extrem stabil, autark vom Internet und hält jahrzehntelang.
- **Sternverkabelung & Tiefe Unterputzdosen:** Lass alle Lichtauslässe, Steckdosen und Rollladenmotoren direkt in den zentralen Schaltschrank (Zählerplatz) ziehen. Verwende überall tiefe Elektronikdosen (z.B. von Kaiser), um später flexibel Aktoren oder smarte Klemmen nachzurüsten.
- **Netzwerk-Infrastruktur:** In jedes Zimmer gehören mindestens zwei Cat.7 oder Cat.8 Netzwerkkabel. Vergiss nicht, Kabelauslässe an den Decken für **Zentrale WLAN-Access-Points (PoE)** einzuplanen, um im ganzen Haus perfekten Empfang zu haben.

## Folie 75 — Heizung, Lüftung & Klima (HVAC)

**2. Heizung, Lüftung & Klima (HVAC)**

- **Smarte Heizungsaktoren:** Eine Einzelraumregelung ist Pflicht. Kabelgebundene Stellventile im Heizkreisverteiler, gesteuert über zentrale Smart-Home-Aktoren, arbeiten deutlich präziser als Funk-Thermostate.
- **Integrierte Raumklimasensoren:** Statt klobiger Thermostate an der Wand machen dezente Taster mit integrierten Temperatur- und Luftfeuchtigkeitssensoren Sinn.
- **Schnittstelle zur Wärmepumpe / Lüftungsanlage:** Achte darauf, dass deine neue Heizung über Modbus, LAN oder SG-Ready-Kontakte mit dem Smart Home kommunizieren kann, um PV-Strom optimal zu nutzen.

## Folie 76 — Beleuchtung & Beschattung

**3. Beleuchtung & Beschattung**

- **Zentrale Dimm-Aktoren:** Nutze 24V-LED-Beleuchtung (DALI oder KNX) für dimmbares, flackerfreies Licht. Die Netzteile sitzen im Schaltschrank, nicht in der Decke.
- **Smarte Rollladen- / Jalousiemotoren:** Setze auf einfache, robuste 230V-Motoren ohne eigenen Funk. Die Intelligenz zieht in den Schaltschrank ein. So kann die Beschattung vollautomatisch nach Sonnenstand, Raumtemperatur und Windwächter gesteuert werden.
- **Präsenzmelder statt Bewegungsmelder:** Plane in Durchgangsräumen (Flur, Bad, Küche, Abstellraum) echte Präsenzmelder an der Decke ein. Sie erkennen auch, wenn du still am Schreibtisch sitzt oder in der Badewanne liegst, und machen klassische Lichtschalter fast überflüssig.

## Folie 77 — Sicherheit & Zutritt

**4. Sicherheit & Zutritt**

- **Motorschloss in der Haustür:** Lass direkt ein kabelgebundenes Motorschloss (z.B. von Fuhr oder KFV) in die Haustür einbauen. In Kombination mit einem Fingerprint-Reader oder Keypad öffnest du die Tür schlüssellos und sicher.
- **Fensterkontakte (Reed-Kontakte):** Bestelle die neuen Fenster direkt ab Werk mit integrierten, kabelgebundenen Reed-Kontakten im Rahmen. Damit weiß dein System, ob ein Fenster offen, gekippt oder verriegelt ist – essenziell für die Alarmanlage und die Heizungsabschaltung beim Lüften.
- **Kabel-Überwachungskameras:** Plane PoE-Kabel (Power over Ethernet) an den Hausecken ein. Kabelgebundene Kameras sind absolut manipulationssicher und benötigen keine Batterien.

## Folie 78 — Wichtige Planungs-Tipps für die Praxis

**Wichtige Planungs-Tipps für die Praxis:**

1. **Gewerkeübergreifend denken:** Lass den Elektriker und den Heizungsbauer nicht isoliert arbeiten. Die Heizung muss wissen, was die Verschattung tut, und das Licht muss mit den Präsenzmeldern harmonieren.
2. **Der "Alles-Aus"-Schalter:** Plane neben der Haustür und dem Ehebett einen Taster ein, der mit einem Klick das gesamte Licht im Haus ausschaltet, die Heizung absenkt und die Beschattung in den Nachtmodus versetzt.
3. **Leerrohre, Leerrohre, Leerrohre:** Man kann nie genug haben. Vor allem zum Dachboden (für spätere PV-Anlagen) und in den Garten/Garage (für Wallboxen und Außenbeleuchtung).

## Folie 79 — Frage: Sanierung vs. Neubau

Unterscheidet sich die Planung bei einer Sanierung gegenüber einer Planung bei einem Neubau?

## Folie 80 — Antwort: Sanierung vs. Neubau

**Ja,** die Planung unterscheidet sich in einigen wesentlichen Punkten, obwohl beide Projekte (Neubau und Kernsanierung) die Chance auf ein kabelgebundenes System (wie KNX oder Loxone) bieten. Während du beim Neubau auf einem **weißen Blatt Papier** planst, musst du bei der Kernsanierung immer mit der **bestehenden Substanz** klar kommen.

---

## Folie 81 — Statik, Wände und Schlitze klopfen

### 1. Statik, Wände und Schlitze klopfen

- **Im Neubau:** Der Architekt plant die Schlitze und Durchbrüche direkt im Beton oder Mauerwerk ein. Kabeltrassen laufen sauber über den Rohboden, bevor der Estrich gegossen wird. Es gibt keine Einschränkungen bei der Platzierung von Schaltern oder Displays.
- **In der Kernsanierung: Die Statik setzt Grenzen.** Du darfst tragende Wände oder alte Betondecken nicht unbegrenzt horizontal aufschlitzen, um dicke Kabelbündel zu verlegen. Oft musst du auf Abhängecken (Trockenbau) oder Vorsatzschalen ausweichen, um die Busleitungen und die Sternverkabelung zum Schaltschrank zu führen.

## Folie 82 — Platz für den Schaltschrank (Der "Gehirn-Raum")

### 2. Platz für den Schaltschrank (Der "Gehirn-Raum")

- **Im Neubau:** Der Hausanschlussraum wird von Anfang an groß genug geplant. Ein smarter Schaltschrank für ein Einfamilienhaus ist oft doppelt oder dreimal so groß wie ein Standard-Zählerkasten, da alle Aktoren und Netzteile dort Platz finden müssen.
- **In der Kernsanierung: Platzmangel ist das größte Problem.** Oft muss der neue, riesige Schaltschrank in einen engen Kellerflur oder eine Nische gequetscht werden. Hier ist eine extrem präzise Platzplanung im Vorfeld nötig – manchmal müssen Aktoren dezentral in tiefe Elektronikdosen in die Räume ausgelagert werden.

## Folie 83 — Fußbodenaufbau und Heizung

### 3. Fußbodenaufbau und Heizung

- **Im Neubau:** Der Fußbodenaufbau (Dämmung + Estrich) ist hoch genug (meist 14–16 cm). Kabel und die Rohre der Fußbodenheizung haben nebeneinander perfekt Platz.
- **In der Kernsanierung:** Oft ist die Raumhöhe begrenzt und der alte Estrich kann nicht beliebig dick ersetzt werden. Wird eine Fußbodenheizung nachträglich eingefräst oder ein Dünnbettsystem genutzt, gibt es **keinen Platz auf dem Boden für Smart-Home-Kabel**. Diese müssen dann komplett über die Decke oder die Wände umgeleitet werden.

## Folie 84 — Fenster und Verschattung

### 4. Fenster und Verschattung

- **Im Neubau:** Fensterkontakte (Reed-Kontakte) und die Stromzuleitungen für Raffstores/Rollläden werden direkt ab Werk in die Maße der Rohbauöffnungen integriert.
- **In der Kernsanierung:** Wenn die alten Fensterstürze (oft aus massivem Beton) erhalten bleiben, ist der Platz für elektrische Rollladenkästen extrem eng. Auch das nachträgliche Einbohren von Kabeln für Fensterkontakte in bestehende Rahmen erfordert chirurgische Präzision, damit die Dichtigkeit nicht leidet.

## Folie 85 — Hybrid-Lösung: Der Geheimtipp für die Kernsanierung

### Hybrid-Lösung: Der Geheimtipp für die Kernsanierung

Weil das Schlitzen von Wänden bei einer Sanierung extrem aufwendig und teuer ist, planen viele Sanierer ein **Hybrid-System**:

- **Kabel (Bus)** für die kritischen, unbeweglichen Infrastrukturen: Schaltschrank, Heizungsventile, Rollladenmotoren und Decken-Präsenzmelder.
- **Funk (z.B. KNX-RF oder Homematic IP wired/funk kombiniert)** für die Lichtschalter an den Wänden. So sparst du dir das vertikale Aufschlitzen der Wände zu jedem einzelnen Lichtschalter und klebst stattdessen flache Funktaster auf.

## Folie 86 — (ohne Titel)

Keine Textinhalte. Reine Hintergrundfolie.

## Folie 87 — Aufgabe

### Aufgabe:

Eine **Eigentums- oder Mietwohnung** wird nachgerüstet.

1. Welche Nachrüstung ist möglich?
2. Welcher Übertragungsweg?
3. Welche Smarthome Komponenten machen in euren Augen Sinn?

## Folie 88 — (ohne Titel)

Für eine **Mietwohnung** sind kabelgebundene Systeme wie KNX oder Loxone komplett vom Tisch. Hier ist Funk-Smart-Home dein perfekter Weg: Alle Komponenten werden einfach geklebt, gesteckt oder zerstörungsfrei ausgetauscht. Beim Auszug nimmst du alles rückstandslos mit in dein neues Zuhause.

Die folgenden Optionen und Systeme machen in einer Mietwohnung den größten Sinn, ohne dass du Ärger mit dem Vermieter riskierst.

## Folie 89 — Das passende Funksystem wählen

### 1. Das passende Funksystem wählen

Setze in einer Mietwohnung auf etablierte Funkstandards, damit du herstellerunabhängig bleiben kannst:

- **Matter & Thread:** Der neueste, zukunftssicherste Standard. Geräte verschiedener Marken (Apple, Google, Amazon, Eve etc.) arbeiten direkt und extrem schnell zusammen.
- **Zigbee:** Der absolute Klassiker für smarte Beleuchtung und Sensoren (z.B. Philips Hue, IKEA Dirigera, Aqara). Extrem energiesparend und baut ein stabiles "Mesh-Netzwerk" von Gerät zu Gerät auf.
- **Homematic IP / Bosch Smart Home:** Eigenständige Funksysteme (nutzen ein eigenes Frequenzband), die extrem zuverlässig für Heizung und Sicherheit funktionieren.

## Folie 90 — Die besten Komponenten für Mietwohnungen

### 2. Die besten Komponenten für Mietwohnungen

![Glühbirnen-Icon neben der Zwischenüberschrift](images/img-090-059.png)

> **Beschreibung:** Kleines Icon einer leuchtenden gelben Glühbirne auf schwarzem Hintergrund. Es steht als Symbol links neben der Zwischenüberschrift "Beleuchtung & Strom" und kennzeichnet den Themenblock Licht und Strom.

**Beleuchtung & Strom**

- **Smarte Leuchtmittel (Plug & Play):** Tausche einfach die vorhandenen Glühbirnen gegen smarte LEDs (z.B. **Philips Hue** oder **IKEA Tradfri**). Die alten Leuchtmittel bewahrst du für den Auszug auf.
- **Smarte Zwischenstecker (Plugs):** Damit machst du Stehlampen, Kaffeemaschinen oder den Ventilator fit fürs Smart Home. Sie werden einfach in die Steckdose gesteckt.
- **Smarte Schalter zum Überkleben:** Damit niemand den physischen Lichtschalter ausschaltet (wodurch smarte Lampen stromlos und offline wären), gibt es Halterungen oder flache Funktaster (z.B. von Hue oder Senic), die einfach über oder neben die alten Schalter an die Wand geklebt werden.

---

## Folie 91 — Heizung & Klima

- **Smarte Heizkörperthermostate:** Das bringt in Mietwohnungen oft die größte Ersparnis. Du schraubst das alte Thermostat per Hand (oder Rohrzange) ab und das neue (z.B. **Eve Thermo**, **Homematic IP** oder **tado°**) an.
- *Wichtig:* Die alten Thermostate unbedingt aufbewahren!

## Folie 92 — Zutritt & Sicherheit

- **Smarte Türschlösser (Nachrüst-Sets):** Systeme wie das **Nuki Smart Lock** oder **Yale Linus** werden einfach von innen auf deinen bestehenden Schließzylinder aufgesetzt (oft nur geklemmt oder geklebt). Von außen sieht man nichts, dein physischer Schlüssel funktioniert weiterhin, und du musst kein Schloss austauschen.
- **Geklebte Sensoren:** Fenster- und Türkontakte sowie Bewegungsmelder von Marken wie **Aqara** oder **Eve** sind winzig und werden komplett mit spurlos ablösbaren Klebestreifen befestigt.

## Folie 93 — (ohne Titel)

_Folie ohne Textinhalt und ohne Schaubild (nur Hintergrund und Fußzeile)._

## Folie 94 — Aufgabe:

Ein **_Einfamilienhaus_** wird neu errichtet.

1. Welche ist möglich?
2. Welcher Übertragungsweg?
3. Welche Smarthome Komponenten machen in euren Augen Sinn

## Folie 95 — (ohne Titel)

_Folie ohne Textinhalt und ohne Schaubild (nur Hintergrund und Fußzeile)._

## Folie 96 — (ohne Titel)

_Folie ohne Textinhalt und ohne Schaubild (nur Hintergrund und Fußzeile)._

## Folie 97 — (ohne Titel)

![Abschiedsmotiv im Retro-Stil](images/img-097-061.png)

> **Beschreibung:** Quadratische Illustration im Vintage-Look mit dunkelbraunem Hintergrund. Im Zentrum steht ein türkisfarbener Delfin mit geöffnetem Maul vor einer roten, konzentrischen Zielscheibe mit Rasterstruktur. Oben steht in cremefarbener Schrift „So long and…“ im Retro-Stil, darunter ein geschwungener englischer Abschiedsspruch in Schreibschrift mit Schattenwurf. Die Grafik ist ein humorvoller Abschiedsgruß und hat keinen inhaltlichen Bezug zum Smart-Home-Thema.

---

