namespace HorizonShop.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddAddressDetails : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "City", c => c.String());
            AddColumn("dbo.Users", "Country", c => c.String());
            AddColumn("dbo.Users", "ZipCode", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "ZipCode");
            DropColumn("dbo.Users", "Country");
            DropColumn("dbo.Users", "City");
        }
    }
}
