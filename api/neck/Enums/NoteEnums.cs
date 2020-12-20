
namespace neck.Enums
{
    public enum NoteValue
    {
        C = 0,
        D = 2,
        E = 4,
        F = 5,
        G = 7,
        A = 9,
        B = 11
    }

    public enum NoteSuffix
    {
        DoubleFlat = -2,
        Flat = -1,
        Natural = 0,
        Sharp = 1,
        DoubleSharp = 2
    }

    public enum Interval
    {
        Root = 0,
        //PerfectUnison = 0,
        MinorSecond = 1,
        MajorSecond = 2,
        MinorThird = 3,
        MajorThird = 4,
        PerfectFourth = 5,
        DiminishedFifth = 6,
        AugmentedFourth = 6,
        PerfectFifth = 7,
        MinorSixth = 8,
        MajorSixth = 9,
        MinorSeventh = 10,
        MajorSeventh = 11,
        PerfectOctave = 12
    }

    public enum AugmentedInterval
    {
        DiminishedSecond = 0,
        AugmentedUnison = 1,
        DiminishedThird = 2,
        AugmentedSecond = 3,
        DiminishedFourth = 4,
        AugmentedThird = 5,
        DiminishedFifth = 6,
        AugmentedFourth = 6,
        DiminishedSixth = 7,
        AugmentedFifth = 8,
        DiminishedSeventh = 9,
        AugmentedSixth = 10,
        DiminishedOctave = 11,
        AugmentedSeventh = 12,
    }
}
