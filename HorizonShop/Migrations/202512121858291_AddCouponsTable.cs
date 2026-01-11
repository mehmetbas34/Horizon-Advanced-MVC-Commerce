namespace HorizonShop.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddCouponsTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Coupons",
                c => new
                    {
                        CouponId = c.Int(nullable: false, identity: true),
                        Code = c.String(nullable: false),
                        DiscountRate = c.Int(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.CouponId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Coupons");
        }
    }
}
