# :construction: HD Viz Manuale Utente v0.2.0 [WIP] :construction:

## Indice

- [Introduzione](#introduzione)
  - [Scopo del prodotto](#scopo-del-prodotto)
- [Requisiti di sistema](#requisiti-di-sistema)
  - [Prerequisiti](#prerequisiti)
  - [Requisiti Software](#requisiti-software)
  - [Requisiti Hardware](#requisiti-hardware)
- [Server (Installazione opzionale)](#server-installazione-opzionale)
  - [Installazione](#installazione)
  - [Configurazione](#configurazione)
  - [Esecuzione](#esecuzione)
- [Web app (Installazione obbligatoria)](#web-app-installazione-obbligatoria)
  - [Installazione](#installazione-1)
  - [Esecuzione](#esecuzione-1)
- [Istruzioni per l'utilizzo di HD Viz](#istruzioni-per-lutilizzo-di-hd-viz)
  - [Caricamento dataset](#caricamento-dataset)
    - [Caricamento tramite file .csv](#caricamento-tramite-file-csv)
    - [Caricamento tramite DB](#caricamento-tramite-db)
  - [Selezione tipo di visualizzazione](#selezione-tipo-di-visualizzazione)
  - [Selezione variabili feature e target](#selezione-variabili-feature-e-target)
  - [Opzioni di Visualizzazione](#opzioni-di-visualizzazione)
  - [Visualizzazione grafico](#visualizzazione-grafico)
- [Visualizzazioni](#visualizzazioni)
  - [Scatter Plot Matrix](#scatter)
  - [Heatmap](#heatmap)
    - [Correlation Heatmap](#correlation)
  - [Forcefield](#forcefield)
  - [Linear Projection](#linear-projection)
    - [PCA](#pca)
    - [UMAP](#umap)
  - [Parallel Coordinates](#parallel)

## Introduzione

### Scopo del prodotto

**HD Viz** è una web app per la visualizzazione di dati multidimensionali. È stata sviluppata per dare supporto agli utenti durante la fase esplorativa dell'analisi dei dati.
Le visualizzazioni vengono create tramite la libreria [d3.js](https://d3js.org/).

Il sistema si divide in due parti:

- la web app vera e propria;
- il server per il recupero dei dati da database.

## Requisiti di sistema

### Prerequisiti

- [Yarn v1.22.0](https://yarnpkg.com/) o superiore.

Se si vuole eseguire il server è necessario:

- [Node v14.0.0](https://nodejs.org/it/) o superiore.

### Requisiti Software

- **Sistema Operativo**:
  - Windows 10;
  - MacOS 10.13;
  - Debian 8.10;
  - Ubuntu 18.10.
- **Browser**:
  - Google Chrome v57 o superiore;
  - Microsoft Edge v15 o superiore;
  - Mozilla Firefox v48 o superiore;
  - Safari v10 o superiore;
  - Opera v44 o superiore.

### Requisiti Hardware

HD Viz consiste in una web app, perciò le configurazioni minime prevedono:

- **Processore dual-core**;
- **2GB di memoria RAM**.

---

## Server (installazione opzionale)

Il server è necessario solo per il recupero dati da database, per questo la sua installazione ed esecuzione non è obbligatoria.

L'utente può collegarsi ai vari tipi di database soltanto se precedentemente già installati su una macchina.
Ci sono 4 tipi di database compatibili con la componente server di HD Viz e sono:

- MySQL;
- SQLite;
- PostgreSQL;
- MongoDB.

### Installazione

1. Scaricare `server.zip` dall'ultima [release](https://github.com/CodeOfDutyJS/hdviz/releases/latest) presente su GitHub;
2. estrarre lo zip;
3. posizionarsi nella cartella del server in cui è presente il file `package.json`;
4. eseguire il comando `yarn` da terminale per installare le dipendenze necessarie.

### Configurazione

Prima di poter eseguire l'applicazione è necessario configurare i file per le connessioni ai database.
In particolare per configurare correttamente un database è necessario creare un file con estensione `json` dentro la cartella `src/config`, specificando come da esempio le caratteristiche del DB da aggiungere (è possibile configurare più file per più connessioni).

```json=
{
  "DB_Name": "My Database",
  "DB_Address": "192.168.1.100", // oppure indirizzo del file per sqlite
  "DB_Username": "root",
  "DB_Password": "admin",
  "DB_Type": "mysql", // oppure "postgresql" o "mongodb" o "sqlite"
  "DB_Port": 3306
}
```

Il campo `DB_Type` può essere:

- `mysql`;
- `postgresql`;
- `mongodb`;
- `sqlite`.

### Esecuzione

Per eseguire il server è sufficiente:

1. aprire un terminale;
2. posizionarsi nella cartella del server in cui è presente il file `index.js`;
3. avviare il server immettendo da terminale il seguente comando: `node index.js`;

Il server è ora in esecuzione nella porta `1337` se non specificato differentemente nel file `config.json` all'interno della cartella pricipale.

---

## Web app (installazione obbligatoria)

### Installazione

1. scaricare `client.zip` dall'ultima [release](https://github.com/CodeOfDutyJS/hdviz/releases/latest) presente su GitHub;
2. estrarre lo zip;
3. aprire un terminale e installare `serve` utilizzando il comando `yarn global add serve`.

### Esecuzione

Per eseguire la web app è sufficiente:

1. posizionarsi all'interno della cartella dove si è estratto lo zip;
2. se necessario aggiornare l'url del server nel file `config.js` nella cartella principale;
3. aprire il terminale;
4. immettere il comando `serve -s .` per avviare l'applicazione.

La web app è ora in funzione e disponibile nella porta `5000` (se non specificato differentemente da `serve`).

---

## Istruzioni per l'utilizzo di HD Viz

### Caricamento dataset

![](https://i.imgur.com/HbJM4ZY.gif)

Per caricare il dataset sono offerte due possibilità:

1. caricamento tramite **file .csv**;
2. caricamento tramite **DB**.

#### Caricamento tramite file .csv

Spostandosi nella relativa tab è possibile vedere il pulsante di upload, il quale rimanderà al file manager predefinito la scelta del file da caricare.

![](https://i.imgur.com/Hr3o6oM.gif)

#### Caricamento tramite DB

È necessario aver installato e avviato il [server](#Server-opzionale). Spostandosi nella tab `Database` è possibile visualizzare due campi:

1. **Database Connection**: indica il nome del database dal quale si vuole estrarre il dataset;
2. **Data Table**: indica la tabella specifica del database specificato, dalla quale si vuole estrarre il dataset.

Se nell'elenco dei database non fosse presente quello richiesto, è necessario configurare il server come da [esempio](#Configurazione).

![](https://i.imgur.com/6mDgK7l.gif)

### Selezione tipo di visualizzazione

È possibile scegliere fra uno di questi sette tipi di visualizzazione:

- Force Field;
- Linear Projection;
  - Linear Projection con PCA;
  - Linear Projection con UMAP.
- Parallel Coordinates;
- Heatmap;
- Correlation Heatmap;
- Scatter Plot Matrix.

![](https://i.imgur.com/N71MCp3.gif)

### Selezione variabili feature e target

È obbligatorio specificare le variabili feature sulle quali si vuole effettuare l'analisi.
È possibile selezione al massimo 2 variabili target che influenzeranno le visualizzazioni.
Le feature devono essere numeriche, mentre le variabili target possono essere sia valori numerici che stringhe.

![](https://i.imgur.com/BBD3UUg.gif)

### Opzioni di Visualizzazione

Le opzioni di visualizzazione variano per ogni tipo di visualizzazione scelta.

![](https://i.imgur.com/XpOpQtS.gif)

### Visualizzazione grafico

Per la visualizzazione del grafico, è sufficiente premere sul pulsante `Start`.

![](https://i.imgur.com/pCIJ2mv.gif)

## Visualizzazioni

Di seguito verranno descritte le visualizzazioni offerte da Hd Viz, accompagnate dalle immagini dei grafici costruiti con il [dataset iris](https://gist.github.com/curran/a08a1080b88344b0c8a7).

### Scatter Plot Matrix

La visualizzazione Scatter Plot Matrix mostra una griglia di grafici di dispersione,
per ogni coppia di feature selezionate viene costruito un grafico all'interno della griglia,
l'ordinata e l'ascissa di tale grafico rappresentano i valori delle feature a esso associate.\
E' possibile selezionare alcuni punti all'interno di un grafico,
quando selezionati, questi punti saranno evidenziati anche negli altri grafici della griglia permettendo quindi di
vedere come cambia la loro distribuzione a seconda delle feature che sono associate ad un singolo grafico.\
In questa visualizzazione non è possibile selezionare un numero di feature maggiore di 5, per prevenire la creazione di griglie troppo "dense".

<img src="https://i.imgur.com/Oby9ato.png" width="400" height="400"/>

#### Opzioni

1. Normalizzazione: è possibile normalizzare il dataset prima di visualizzare il grafico, le funzioni di normalizzazione disponibili sono Standard Score, Euclidean Length Normalization e Manhattan Length Normalization.

### Heatmap

La Heatmap è una matrice che ha come colonne le features selezionate e come righe i record del dataset caricato.\
Ogni casella della Heatmap viene colorata in base al valore che assume il record di quella riga nella feature della colonna corrispondente,
più alto sarà il valore e più scura risulterà la casella.

<img src="https://imgur.com/mCHdxaP.png" width="400" height="400"/>

#### Opzioni

1. Range Color: è possibile selezionare i colori con cui visualizzare la Heatmap;
2. Distanza: è possibile scegliere con quale matrice di distanza calcolare il clustering;
3. Clustering: è possibile scegliere come verranno clusterizzate le righe;
4. Normalizzazione: è possibile normalizzare il dataset prima di visualizzare il grafico, le funzioni di normalizzazione disponibili sono Standard Score, Euclidean Length Normalization e Manhattan Length Normalization.

### Correlation Heatmap

La Correlation Heatmap è un tipo particolare di Heatmap in cui sia le colonne che le righe sono rappresentate dalle feature,
il colore di una singola casella è determinato quindi dalla dipendenza tra le due feature corrispondenti alla casella,
la dipendenza tra le feature è calcolata tramite il coefficiente di Pearson, tanto più alto sarà questo valore tanto più scura risulterà la casella.

<img src="https://imgur.com/fGu1b91.png" width="400" height="400"/>

#### Opzioni

1. Range Color: è possibile selezionare i colori con cui visualizzare la Heatmap;
2. Clustering: è possibile scegliere come verranno clusterizzate le righe;
3. Normalizzazione: è possibile normalizzare il dataset prima di visualizzare il grafico, le funzioni di normalizzazione disponibili sono Standard Score, Euclidean Length Normalization e Manhattan Length Normalization.

### Forcefield

Il Forcefield simula l'interazione tra forze in un grafo, gli archi esercitano una forza attrattiva sui nodi da essi collegati e i nodi esercitano una forza repulsiva tra di loro.\
Nella visualizzazione i nodi del grafo sono i record del dataset, l'arco che unisce un nodo A ad un nodo B è pesato in base alla distanza tra i record raffigurati da A e B,
più due record sono vicini (cioè i valori delle loro feature sono simili) più l'arco che unisce i due nodi eserciterà una forza maggiore e i nodi risulteranno più vicini nel grafo visualizzato.\
Per avere una visualizzazione più chiara gli archi non vengono visualizzati.

<img src="https://imgur.com/Kyg6fst.png" width="400" height="400"/>

#### Opzioni

1. Matrice di Distanza: è possibile scegliere la funzione di distanza (Euclidea o Manhattan) necessaria per calcolare la distanza tra i record e quindi il peso degli archi;
2. Normalizzazione: è possibile normalizzare il dataset prima di visualizzare il grafico, le funzioni di normalizzazione disponibili sono Standard Score, Euclidean Length Normalization e Manhattan Length Normalization.

### Linear Projection

Questa visualizzazione proietta dei punti multidimensionali, cioè record di un dataset contenente diverse feature, in uno spazio a 2 dimensioni.
Hd Viz utilizza due diversi algoritmi per eseguire la riduzione dimensionale.

#### PCA

La Principal Components Analysis riduce il numero di variabili originali a un numero minore di nuove variabili tramite una trasformazione lineare che minimizzi la perdita d'informazione.\
Nella Linear Projection con PCA vengono visualizzati anche gli assi originali, proiettati nel nuovo sistema cartesiano.

<img src="https://imgur.com/gzOX99y.png" width="400" height="400"/>

#### UMAP

Uniform Manifold Approximation and Projection è un algoritmo di riduzione dimensionale non lineare, UMAP costruisce un grafo a multi dimensioni per rappresentare i dati, dopo ottimizza un grafo a minore dimensione in modo tale che sia il più simile possibile a quello originale.

<img src="https://imgur.com/Tr8TFvj.png" width="400" height="400"/>

#### Opzioni

1. Normalizzazione: è possibile normalizzare il dataset prima di visualizzare il grafico, le funzioni di normalizzazione disponibili sono Standard Score, Euclidean Length Normalization e Manhattan Length Normalization;
2. Neighbors number (UMAP): indica il numero di vicini da considerare nella costruzione del grafo originale, più il valore è basso e più l'algoritmo si concentrerà sulle strutture locali del dataset, viceversa più è alto e più la visualizzazione mostrerà le strutture globali del dataset;
3. Min distance (UMAP): è la distanza minima tra i punti mostrati nella visualizzazione.
4. Spread (UMAP): definisce la scala dei punti proiettati, insieme a Min distance controlla la dispersione dei punti visualizzati.

### Parallel Coordinates

In questa visualizzazione le variabili (feature) vengono disposte su linee parallele verticali, un punto (record) del dataset è rappresentato dalla linea spezzata che va a intersecare le linee verticali delle variabili, il punto in cui la linea che rappresenta il record va a intersecare la linea della variabile dipende dal valore che assume quel record in quella determinata variabile.

<img src="https://imgur.com/smI7pNU.png" width="400" height="400"/>

#### Opzioni

1. Normalizzazione: è possibile normalizzare il dataset prima di visualizzare il grafico, le funzioni di normalizzazione disponibili sono Standard Score, Euclidean Length Normalization e Manhattan Length Normalization.
