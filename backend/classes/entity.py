class Entity:
    def __init__(self, value, entityType, context, start, end):
        self.value = value
        self.entityType = entityType
        self.context = context
        self.start = start
        self.end = end
        
    def __str__(self):
        return self.entityType + ": " + self.value + " Pos: (" + str(self.start) + ", " + str(self.end) + "\n" + self.context 