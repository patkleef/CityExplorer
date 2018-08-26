namespace CityExplorer.Functions.Events
{
    public class EventInputCriteria
    {
        public string Key => "Events";
        public string Category { get; set; }
        public string DateCriteria { get; set; }
        public double Range { get; set; }
        public Coordinates VisitorCoordinates { get; set; }
    }
}
