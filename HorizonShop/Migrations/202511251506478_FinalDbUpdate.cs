namespace HorizonShop.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FinalDbUpdate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Payments",
                c => new
                    {
                        PaymentId = c.Int(nullable: false, identity: true),
                        OrderId = c.Int(nullable: false),
                        CardHolderName = c.String(nullable: false),
                        CardNumber = c.String(nullable: false),
                        ExpiryMonth = c.Int(nullable: false),
                        ExpiryYear = c.Int(nullable: false),
                        CVV = c.String(nullable: false),
                        PaymentDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.PaymentId)
                .ForeignKey("dbo.Orders", t => t.OrderId, cascadeDelete: true)
                .Index(t => t.OrderId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Payments", "OrderId", "dbo.Orders");
            DropIndex("dbo.Payments", new[] { "OrderId" });
            DropTable("dbo.Payments");
        }
    }
}
