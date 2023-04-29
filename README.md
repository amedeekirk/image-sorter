# XY's Image Sorter
Roughly a year long project, done as a fun voting activity used by several discord communities I am a part of. Users would be provided two images, and vote for their favorite. Over time the worst rated images would be deleted until the final 1,000 remained.

Images were scraped using https://github.com/Seklfreak/discord-image-downloader-go and then stored in AWS S3. Image data was stored in Amazon RDS and client application was stored in an Elastic Beanstalk instance. Image deletion was automated with Lambda + EventBridge.

This was a project originally to test the above scraper, but quickly evolved to a fantastic excuse to finally learn my way around AWSm as well as povide a (shockingly) well received web app that provided hours of entertainment to so many users throughout 2022. Thank you for everyone who used this app!

## Stats
Initial image count: Roughly 23,000
Total Users: 446
Total Votes: 100,000
Average Votes per Session: 20.02


