<<<<<<< HEAD
# 📚 Book Review Application
=======
# 📚 Book Review Application (Sivers-Style)
>>>>>>> 9679cda (first commit)

Eine minimalistische, performante Webanwendung für Buchrezensionen. Die Anwendung setzt auf Server-Side Rendering (SSR) mit EJS und nutzt PostgreSQL zur dauerhaften Datenspeicherung sowie die Open Library API für automatische Buch-Cover.

## 🚀 Features

- **Minimalistisches Design:** Ein klares, textfokussiertes Layout mit Fokus auf Rezensionen und Bewertungen.
- **Vollständiges CRUD:** Einträge können direkt über die Benutzeroberfläche hinzugefügt, bearbeitet und gelöscht werden.
- **Dynamische Sortierung:** Sortierung der Bücher nach **Bewertung** (1–10 Sterne) oder **Aktualität** (Zuletzt gelesen).
- **Automatische Buch-Cover:** Verknüpfung über die ISBN, um Buchcover dynamisch über die Open Library API nachzuladen.
- **Moderne Architektur:** Aufgebaut als Node.js ES-Modul (`"type": "module"`) mit Express, EJS-Templates und asynchronen Client-Anfragen via **Axios**.
- **ISB:** ISB wird validiert

---

## 🛠️ Technologien

- **Backend:** Node.js (v18+), Express
- **Datenbank:** PostgreSQL
- **Template Engine:** EJS (Embedded JavaScript)
- **HTTP-Client:** Axios (für asynchrone API-Interaktionen im Frontend)
- **Schnittstelle:** Open Library Covers API

---

## 📦 Installation & Setup

### 1. Repository klonen & Abhängigkeiten installieren
Navigiere in dein Projektverzeichnis und installiere die benötigten npm-Pakete:

```bash
npm install
```

### 2. PostgreSQL Datenbank vorbereiten
Erstelle eine neue Datenbank in PostgreSQL (z. B. `book_reviews_db`) und führe das folgende SQL-Skript aus, um die Tabelle zu erstellen und initiale Beispieldaten einzufügen:

```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    review TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (title, author, isbn, review, rating, created_at) VALUES
('The Courage to Be Disliked', 'Ichiro Kishimi', '9781501197277', 'A profound philosophy book communicating the psychology of Alfred Adler.', 10, '2026-01-15'),
('You Can Negotiate Anything', 'Herb Cohen', '9780553281095', 'Everything is negotiable. Challenge authority. Classic master negotiator tips.', 10, '2026-03-22');
```

### 3. Umgebungsvariablen einrichten
Erstelle eine Datei namens `.env` im Wurzelverzeichnis des Projekts und trage deine PostgreSQL-Zugangsdaten ein:

```env
PORT=3000
DB_USER=dein_postgres_username
DB_PASSWORD=dein_postgres_passwort
DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_reviews_db
```

---

## 💻 Anwendung starten

Starte den Server lokal mit Node.js:

```bash
node server.js
```

Öffne anschließend deinen Browser und rufe die Anwendung unter **`http://localhost:3000`** auf.

---

## 🔌 API-Endpunkte

Die Anwendung kombiniert klassische Formular-Übertragungen für synchrone Aktionen mit asynchronen API-Schnittstellen:


| Methode | Endpunkt | Beschreibung |
| :--- | :--- | :--- |
| **GET** | `/` | Rendert die Hauptseite mit allen Büchern (unterstützt Query-Parameter `sortBy` und `order`). |
| **POST** | `/books/save` | Erstellt ein neues Buch oder aktualisiert ein bestehendes (falls eine `id` übergeben wird). |
| **GET** | `/api/books/:id` | Holt die JSON-Daten eines einzelnen Buchs für die Editier-Ansicht (via Axios). |
| **DELETE**| `/api/books/:id` | Löscht ein Buch permanent aus der PostgreSQL-Datenbank (via Axios). |

---

## 🔒 Sicherheitshinweise

- **SQL-Injection Schutz:** Die Sortierparameter (`sortBy` und `order`) werden vor der SQL-Abfrage über eine strikte Whitelist validiert. Alle Eingabedaten für Create- und Update-Befehle nutzen parametrisierte Queries (`$1, $2, ...`), um Schadcode-Injektionen zu verhindern.
- **XSS-Schutz:** EJS escaped standardmäßig alle Ausgaben mittels `<%= %>`, sodass potenziell bösartiger HTML-/JS-Code in Rezensionen harmlos als Text dargestellt wird.
