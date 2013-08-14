//
//  ProductsTableViewController.h
//  ControlsPOC
//
//  Created by Soki on 8/14/13.
//  Copyright (c) 2013 Norte23. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ProductsTableViewController : UITableViewController <UITableViewDataSource, UITableViewDelegate, UIActionSheetDelegate>
{
	NSMutableArray *productEntries;
	//BikeSettings *bikeSettings;
	//NSInteger deleteGasEntryID;
}

//@property (nonatomic) NSInteger bikeID;
//@property (nonatomic) NSString *bikeName;
//@property (nonatomic, retain) GasEntry *selectedGasEntry;

-(void)retrieveTableData;

@end

