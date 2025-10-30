# 🔍 TypeSense AI-Powered Search Engine Integration

An **AI-powered intelligent search system** built using **[Typesense](https://typesense.org)** — an open-source, typo-tolerant, lightning-fast search engine with built-in support for **semantic (vector-based)** and **keyword-based** hybrid search.

This project demonstrates how to set up, configure, and integrate Typesense into a modern **Next.js** frontend for high-performance product or content search.

---

## 🚀 Features

**Keyword-based Search (Traditional Search)**  
TypeSense provides instant, typo-tolerant keyword search for text fields like product name, description, etc.

**Semantic Search (AI Vector Search)**  
We use Hugging Face’s `ts/all-MiniLM-L12-v2` model to generate **vector embeddings** for our documents, enabling **meaning-based** search (e.g., “magical wizard” will match “Harry Potter”).

**Hybrid Search (Keyword + Semantic)**  
Combines both text relevance and vector similarity for powerful search results — even if the query uses synonyms or natural language.

**Next.js Frontend Integration**  
Built with Next.js for a smooth developer experience and flexible UI.

**Local Server Setup (WSL Ubuntu)**  
Fully runs on your local system using Ubuntu (via WSL) for easy experimentation and integration.

---

## 🧠 Tech Stack

| Layer | Technology Used |
|--------|------------------|
| **Backend Search Engine** | [Typesense Server v29.0](https://typesense.org) |
| **Frontend Client** | Next.js (React) |
| **AI Model for Embeddings** | `ts/all-MiniLM-L12-v2` from Hugging Face |
| **Language** | JavaScript / Node.js |
| **Platform** | WSL Ubuntu on Windows |

---

## ⚙️ Setup Instructions

### Step 1: Install WSL Ubuntu (Windows only)
```bash
wsl --install
```
### Step 2: Install and Run Typesense Server
```bash
curl -O https://dl.typesense.org/releases/29.0/typesense-server-29.0-amd64.deb
sudo apt install ./typesense-server-29.0-amd64.deb
```
### Step 3: Start the server:
```bash
sudo /usr/bin/./typesense-server --config=/etc/typesense/typesense-server.ini
```

Server will start at:
```bash
http://localhost:8108
```

Check if the server is running:
```bash
curl http://localhost:8108/health
# Response: {"ok": true}
```

To stop the server : 
```bash
sudo systemctl stop typesense-server
```
### Step 4: Get API Key
```bash
sudo cat /etc/typesense/typesense-server.ini | grep api-key
```

Save the key securely — it’ll be used in your client app.
Verify your key:
```bash
curl -H "X-TYPESENSE-API-KEY: your_api_key_here" http://localhost:8108/debug
# Response: {"state":1,"version":"29.0"}
```

### Step 5 : Create Collections
Example for a Books collection:
```bash
curl -X POST "http://localhost:8108/collections" \
  -H "X-TYPESENSE-API-KEY: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "books",
    "fields": [
      {"name": "title", "type": "string"},
      {"name": "author", "type": "string"},
      {"name": "rating", "type": "float"}
    ],
    "default_sorting_field": "rating"
  }'
```

View all collections:

```bash
curl -H "X-TYPESENSE-API-KEY: your_api_key_here" http://localhost:8108/collections
```


Delete a collection:

```bash
curl -X DELETE "http://localhost:8108/collections/books" \
  -H "X-TYPESENSE-API-KEY: your_api_key_here"
```

### Step 6 : Clone repository
Clone the github repository by the following command : 
```bash
git clone https://github.com/Its-keshav-arora/Bytemonk-Typesense.git
```
### Step 7 : Install all the dependencies
Awesome, Now you have the frontend of repo in Next.js , let's install 
all the required dependencies using the command given below :
```bash
npm install
```

### Step 8 : Start the server :
Now start the server using the following command : 
```bash
npm run dev
```


### Step 9 : Import the data
Run the file "import_data.js" in the root directory in different
terminal using the following command:
```bash
node import_data.js
```

Now you can search your products instantly — even with typos like:
```bash
"pixl dron" → "Pixel Drone"
```

### Step 10: Enable Semantic Search (AI Embeddings)
Create a collection with embedding support:
```bash
curl -X POST "http://localhost:8108/collections" \
-H "X-TYPESENSE-API-KEY: your_api_key" \
-H "Content-Type: application/json" \
-d '{
  "name": "books",
  "fields": [
    {"name": "id", "type": "string"},
    {"name": "title", "type": "string"},
    {"name": "authors", "type": "string[]"},
    {"name": "publication_year", "type": "int32"},
    {"name": "average_rating", "type": "float"},
    {"name": "image_url", "type": "string"},
    {"name": "ratings_count", "type": "int32"},
    {
      "name": "embedding",
      "type": "float[]",
      "embed": {
        "from": ["title", "authors"],
        "model_config": {
          "model_name": "ts/all-MiniLM-L12-v2"
        }
      }
    }
  ],
  "default_sorting_field": "ratings_count"
}'
```

### About the Model:
ts/all-MiniLM-L12-v2 is a sentence-transformer model that maps sentences or paragraphs into 384-dimensional dense vectors.
Used for semantic similarity, clustering, and AI-based search.

### Example Use Case
Searching for “magical wizard”

Even if your dataset contains "Harry Potter", "wizard boy", or "Hogwarts hero",
semantic embeddings ensure “magical wizard” → “Harry Potter” shows up in results.

### Troubleshooting
• Server not running?
Run curl http://localhost:8108/health to check.
Restart with:
```bash
sudo systemctl restart typesense-server
```

### License
This project is open-source and licensed under the MIT License.