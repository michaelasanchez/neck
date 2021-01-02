
namespace neck.Enums
{
	public enum ScaleDegree
	{
		Tonic = 1,
		Supertonic = 2,
		Mediant = 3,
		Subdominant = 4,
		Dominant = 5,
		Submediant = 6,
		Subtonic = 7,		// in the natual minor scale
		LeadingTone = 7,	// in the major scale
	}

	public enum ScaleNumeral
	{
		I = 1,
		II = 2,
		III = 3,
		IV = 4,
		V = 5,
		VI = 6,
		VII = 7,
	}

	public enum ScaleType
	{
		Diatonic,
		NaturalMinor,
		Chromatic,
		Pentatonic
	}
}
