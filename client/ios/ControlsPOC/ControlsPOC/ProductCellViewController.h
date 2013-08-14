//
//  ProductCellViewController.h
//  ControlsPOC
//
//  Created by Soki on 8/14/13.
//  Copyright (c) 2013 Norte23. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ProductCellViewController : UITableViewCell

@property (nonatomic, retain) IBOutlet UILabel *descriptionLabel;
@property (nonatomic, retain) IBOutlet UILabel *nameLabel;
@property (nonatomic, retain) IBOutlet UIImageView *productImage;

@end
