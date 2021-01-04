## Terminology
### Offset / Position
All references to a Note's position within reference to the
string and fret on a fretboard use the terminology **Offset** and **Position**.

**Position** refers to a Note's distance from the open position on a single string.
An **Open Position** has the value of zero (0).

**Offset** refers to a string's tuning. Although it uses the `int` type, an offset
value is commonly equal to the `NoteValue` a string is tuned. An **Offset** value
can also represent an accidental note.

Which as I'm writing this realize is a
design flaw since representing  both accidental values for non-natural notes
requires more than a single scalar value.

To be continued..

## Enums
### Step & Interval
A **Step** represents the number of pitches(?) to progress from a given note
to the next note in a scale. Steps are either a Half or Whole step for now.

An **Interval** represets a notes distance from the root note of a scale.