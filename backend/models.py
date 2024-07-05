from gliner import GLiNER
import spacy
import re
from transformers import pipeline
from pdf import extractPDFText
from classes.entity import Entity
from database import saveDocAndEntities

def processDocument(filename, path):

    text = extractPDFText(path)
    
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)
    
    entities = []
    entitiesWithContext = []
    
    entities.extend(getMonetaryValues(text))
    entities.extend(getOrgValues(text))
    
    for entity in entities:
        entitiesWithContext.extend(getContextAndPositions(entity, list(doc.sents)))
    
    saveDocAndEntities(filename, entitiesWithContext)

def getContextAndPositions(entity, doc):
    
    entities = []
    
    for sentence in doc:
        
        if entity.value in sentence.text:
            
            context = sentence.text
    
            positionStart = context.find(str(entity.value))
            positionEnd = positionStart+len(str(entity.value))
                
            entities.append(Entity(entity.value, entity.entityType, context, positionStart, positionEnd))
    
    return entities

def getMonetaryValues(text):
    
    found_values = set()
    values = []

    money_pattern = re.compile(r'R\$ [\w.,]+')
    
    for value in money_pattern.findall(text):
        if value not in found_values:
            found_values.add(value)
            values.append(Entity(value, "money", "", 0, 0))
        
    return values
    
def getOrgValues(text):
    
    model = GLiNER.from_pretrained("urchade/gliner_multi_pii-v1")
    
    found_values = set()
    values = []

    predictedEntities = model.predict_entities(text, labels=["CNPJ","organization"], threshold=0.5)

    for predictedEntity in predictedEntities:
        if predictedEntity["text"] not in found_values:
            found_values.add(predictedEntity["text"])
            values.append(Entity(predictedEntity["text"], predictedEntity["label"], "", 0, 0))
        
    return values