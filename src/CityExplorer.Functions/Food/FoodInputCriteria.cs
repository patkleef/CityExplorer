namespace CityExplorer.Functions.Food
{
    public class FoodInputCriteria
    {
        public string Key => "Food";
        public string Category { get; set; }
        public double Range { get; set; }
        public Coordinates VisitorCoordinates { get; set; }
    }
}
