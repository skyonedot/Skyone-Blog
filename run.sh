cd /home/ubuntu/Website/blog
npm run build
pm2 stop blog
pm2 delete blog
npm run pm2start