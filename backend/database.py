import json
import os
import sqlite3

data_path = 'database/'
databasename = 'granto'

def selectAllDocs():

    db = sqlite3.connect(data_path + databasename + '.sqlite3')
    
    cursor = db.cursor()

    cursor.execute("SELECT * FROM documents")
    rowsDoc = cursor.fetchall()
    
    rows = []
    
    for r in rowsDoc:
        
        fileName = r[1]
        
        cnpjs = []
        orgs = []
        valores = []
    
        cursor.execute("SELECT entityType, value, context, start, end FROM entities WHERE document = '" + str(r[0]) + "'")

        for row in cursor.fetchall():
            
            dado = {
                "valor": row[1],
                "contexto": row[2],
                "inicio": row[3],
                "fim": row[4]
            }

            if row[0] == "CNPJ":
                cnpjs.append(dado)
            elif row[0] == "organization":
                orgs.append(dado)
            elif row[0] == "money":
                valores.append(dado)

        rows.append({"documento": fileName, "cnpj": cnpjs, "empresas": orgs, "valorMonetario": valores})
    
    cursor.close()
    db.close()
    
    #return json.dumps(rows, indent=4, ensure_ascii=False)
    return rows

def saveDocAndEntities(doc, entities):
    
    db = sqlite3.connect(data_path + databasename + '.sqlite3')
    
    cursor = db.cursor()
        
    cursor.execute("INSERT INTO documents (name) VALUES ('" + doc + "')")
        
    cursor.execute("SELECT * FROM documents WHERE name = '" + doc + "'")
    row = cursor.fetchone()
    
    docId = row[0]
    
    for entity in entities:
    
        cursor.execute("INSERT INTO entities (document, value, entityType, context, start, end) VALUES (" + str(docId) + ", '" + entity.value + "', '" + entity.entityType + "', '" + entity.context + "', " + str(entity.start) + ", " + str(entity.end) + ")")
    
    cursor.close()
    db.commit()
    db.close()
    
def migrate():

    os.makedirs(data_path, exist_ok=True)

    db = sqlite3.connect(data_path + databasename + '.sqlite3')
    
    db.execute("""
                   
        CREATE TABLE IF NOT EXISTS documents(
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(1000)
        );

    """)

    db.execute("""
        CREATE TABLE IF NOT EXISTS entities (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            document INTEGER NOT NULL,
            value VARCHAR(100),
            entityType VARCHAR(50),
            context VARCHAR(30000),
            start INTEGER,
            end INTEGER,
            FOREIGN KEY(document) REFERENCES documents (id)
        );
    """
    )
    
    db.close()