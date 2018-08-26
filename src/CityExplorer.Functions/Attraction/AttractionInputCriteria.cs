namespace CityExplorer.Functions.Attraction
{
    public class AttractionInputCriteria
    {
        public string Key => "Attration";
        public string Category { get; set; }
        public double Range { get; set; }
        public Coordinates VisitorCoordinates { get; set; }
    }
}
