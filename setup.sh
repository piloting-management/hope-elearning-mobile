#!/bin/bash

# Terminal çıktısını renklendirme
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Başlangıç
echo -e "${GREEN}--- Başlangıç: Temizlik ve yeniden yükleme işlemi ---${NC}"

# 1. node_modules, package-lock ve iOS Pod dosyalarını temizle
echo -e "${GREEN}1. node_modules, package-lock ve Pod dosyaları temizleniyor...${NC}"
sudo rm -rf node_modules package-lock.json ios/Pods ios/Podfile.lock
if [ $? -ne 0 ]; then
    echo -e "${RED}Hata: Dosyalar temizlenirken bir sorun oluştu!${NC}"
    exit 1
fi
echo -e "${GREEN}Temizlik tamamlandı.${NC}"

# 2. NPM kurulumlarını yap
echo -e "${GREEN}2. npm install komutu çalıştırılıyor...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Hata: npm install sırasında bir sorun oluştu!${NC}"
    exit 1
fi
echo -e "${GREEN}npm install tamamlandı.${NC}"

# 3. iOS Pod kurulumlarına geç
echo -e "${GREEN}3. iOS Pod kurulumu başlatılıyor...${NC}"
cd ios && pod install
if [ $? -ne 0 ]; then
    echo -e "${RED}Hata: pod install sırasında bir sorun oluştu!${NC}"
    exit 1
fi
cd ..
echo -e "${GREEN}iOS Pod kurulumu tamamlandı.${NC}"

# Tamamlandı
echo -e "${GREEN}--- İşlem tamamlandı: Her şey başarıyla yüklendi! ---${NC}"
