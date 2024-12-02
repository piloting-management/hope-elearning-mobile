#!/bin/bash

# Node ve Pod'ları temizle
echo "Removing node_modules, package-lock.json, and iOS Pods..."
sudo rm -rf node_modules package-lock.json ios/Pods ios/Podfile.lock

# Node.js bağımlılıklarını yükle
echo "Installing npm packages..."
npm install

# iOS bağımlılıklarını yükle
echo "Installing iOS Pods..."
cd ios && pod install

echo "Cleanup and installation complete!"
