# HD Viz

## Introduzione

### Scopo del prodotto

**HD Viz** è una web app per la visualizzazione di dati multidimensionali. È stata sviluppata per dare supporto agli utenti durante la fase esplorativa dell'analisi dei dati.
Le visualizzazioni vengono create tramite la libreria [d3.js](https://d3js.org/).

Il sistema si divide in due parti:
- la web app vera e propria;
- il server per il recupero dei dati da database.

## Requisiti di sistema

### Prerequisiti
- [Yarn v1.22.0](https://yarnpkg.com/) o superiore

Se si vuole eseguire il server è necessario:
- [Node v14.0.0](https://nodejs.org/it/) o superiore

### Requisiti Software
- **Sistema Operativo**:
    - Windows;
    - MacOS;
    - Debian;
    - Ubuntu;
    - RPM-based Linux.
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

## Server (opzionale)
Il server è necessario solo per il recupero dati da database, per questo la sua installazione ed esecuzione non è obbligatoria.

### Installazione
1. Scaricare `server.zip` dall'ultima [release](https://github.com/CodeOfDutyJS/hdviz/releases/latest) presente su GitHub
2. Estrarre lo zip

### Configurazione
Prima di poter eseguire l'applicazione è necessario configurare i file per le connessioni ai database.
In particolare per configurare correttamente un database è necessario:

Creare un file con estensione `json` dentro la cartella `src/config`, specificando come da esempio le caratteristiche del DB da aggiungere (è possibile configurare più file per più connessioni).
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
- `mysql`
- `postgresql`
- `mongodb`
- `sqlite`

### Esecuzione
Per eseguire il server è sufficiente: 
1. Aprire un terminale
2. Posizionarsi nella cartella del server in cui è presente il file `index.js`
3. Avviare il server immettendo da terminale il seguente comando:`node index.js`

Il server è ora in esecuzione nella porta `1337`.

---

## Web App (necessario)

### Installazione 

1. Scaricare `client.zip` dall'ultima [release](https://github.com/CodeOfDutyJS/hdviz/releases/latest) presente su GitHub
2. Estrarre lo zip
3. Aprire un terminale e installare `serve` utilizzando il comando `yarn global add serve`


### Esecuzione
Per eseguire la web app è sufficiente:
1. Posizionarsi all'interno della cartella dove si è estratto lo zip.
2. Aprire il terminale
3. Immettere il comando `serve -s .` per avviare l'applicazione.

La web app è ora in funzione e disponibile nella porta `5000` (se non specificato differentemente da `serve`).

---

## Istruzioni per l'utilizzo di HD Viz

### Caricamento dataset
![](https://i.imgur.com/HbJM4ZY.gif)

Per caricare il dataset sono offerte due possibilità:
1. Caricamento tramite **file .csv**;
2. Caricamento tramite **DB**.

#### Caricamento tramite file .csv
Spostandosi nella relativa tab è possibile vedere il pulsante di upload, il quale rimanderà al file manager predefinito la scelta del file da caricare.

![](https://i.imgur.com/Hr3o6oM.gif)

#### Caricamento tramite DB
(È necessario aver installato e avviato il [server](#Server-opzionale))
Spostandosi nella tab relativa al Database è possibile visualizzare due campi:
1. **Database Connection**: Indica il nome del database dal quale si vuole estrarre il dataset;
2. **Data Table**: Indica la tabella specifica del database specificato, dalla quale si vuole estrarre il dataset.

Se nell'elenco dei database non fosse presente quello richiesto, è necessario configurare il server come da [esempio](#Configurazione).

![](https://i.imgur.com/6mDgK7l.gif)

### Selezione tipo di visualizzazione
È possibile scegliere fra uno di questi sei tipi di visualizzazione:
- Force Field;
- Linear Projection;
- Parallel Coordinates;
- Heatmap;
- Correlation Heatmap;
- Scatter Plot Matrix;

![](https://i.imgur.com/N71MCp3.gif)

### Selezione variabili feature e target
È obbligatorio specificare le variabili feature (numeriche) sulle quali si vuole effettuare l'analisi.
È possibile selezione al massimo 2 variabili target che influenzeranno le visualizzazioni.

![](https://i.imgur.com/BBD3UUg.gif)

### Opzioni di Visualizzazione
Le opzioni di visualizzazione variano per ogni tipo di visualizzazione scelta.

![](https://i.imgur.com/XpOpQtS.gif)

### Visualizzazione grafico
Per la visualizzazione del grafico, è sufficiente premere sul pulsante "Start".

![](https://i.imgur.com/pCIJ2mv.gif)
