#!/bin/bash

# Script para capturar screenshots de los proyectos
# Requiere: npm install -g capture-website-cli

echo "📸 Capturando screenshots de los proyectos..."

# EzTicket
echo "Capturando EzTicket..."
capture-website "https://ezticket.vercel.app/" --output="public/images/projects/ezticket/ezticket-screenshot-1.png" --width=1920 --height=1080
capture-website "https://ezticket.vercel.app/" --output="public/images/projects/ezticket/ezticket-screenshot-2.png" --width=1920 --height=1080 --full-page
capture-website "https://ezticket.vercel.app/" --output="public/images/projects/ezticket/ezticket-screenshot-3.png" --width=768 --height=1024 --emulate-device="iPad"
capture-website "https://ezticket.vercel.app/" --output="public/images/projects/ezticket/ezticket-screenshot-4.png" --width=390 --height=844 --emulate-device="iPhone 12"
capture-website "https://ezticket.vercel.app/" --output="public/images/projects/ezticket/ezticket-screenshot-5.png" --width=1920 --height=1080 --scroll-to-element="footer"

# Comimake
echo "Capturando Comimake..."
capture-website "https://comimake.vercel.app/" --output="public/images/projects/comimake/comimake-screenshot-1.png" --width=1920 --height=1080
capture-website "https://comimake.vercel.app/" --output="public/images/projects/comimake/comimake-screenshot-2.png" --width=1920 --height=1080 --full-page
capture-website "https://comimake.vercel.app/" --output="public/images/projects/comimake/comimake-screenshot-3.png" --width=768 --height=1024 --emulate-device="iPad"
capture-website "https://comimake.vercel.app/" --output="public/images/projects/comimake/comimake-screenshot-4.png" --width=390 --height=844 --emulate-device="iPhone 12"
capture-website "https://comimake.vercel.app/" --output="public/images/projects/comimake/comimake-screenshot-5.png" --width=1920 --height=1080 --scroll-to-element="footer"

# RentyGo
echo "Capturando RentyGo..."
capture-website "https://rentygo.vercel.app/" --output="public/images/projects/rentygo/rentygo-screenshot-1.png" --width=1920 --height=1080
capture-website "https://rentygo.vercel.app/" --output="public/images/projects/rentygo/rentygo-screenshot-2.png" --width=1920 --height=1080 --full-page
capture-website "https://rentygo.vercel.app/" --output="public/images/projects/rentygo/rentygo-screenshot-3.png" --width=768 --height=1024 --emulate-device="iPad"
capture-website "https://rentygo.vercel.app/" --output="public/images/projects/rentygo/rentygo-screenshot-4.png" --width=390 --height=844 --emulate-device="iPhone 12"
capture-website "https://rentygo.vercel.app/" --output="public/images/projects/rentygo/rentygo-screenshot-5.png" --width=1920 --height=1080 --scroll-to-element="footer"

# CoinChaShop
echo "Capturando CoinChaShop..."
capture-website "https://coinchashop.vercel.app/" --output="public/images/projects/coinchashop/coinchashop-screenshot-1.png" --width=1920 --height=1080
capture-website "https://coinchashop.vercel.app/" --output="public/images/projects/coinchashop/coinchashop-screenshot-2.png" --width=1920 --height=1080 --full-page
capture-website "https://coinchashop.vercel.app/" --output="public/images/projects/coinchashop/coinchashop-screenshot-3.png" --width=768 --height=1024 --emulate-device="iPad"
capture-website "https://coinchashop.vercel.app/" --output="public/images/projects/coinchashop/coinchashop-screenshot-4.png" --width=390 --height=844 --emulate-device="iPhone 12"
capture-website "https://coinchashop.vercel.app/" --output="public/images/projects/coinchashop/coinchashop-screenshot-5.png" --width=1920 --height=1080 --scroll-to-element="footer"

# AuCoin
echo "Capturando AuCoin..."
capture-website "https://aucoin.vercel.app/" --output="public/images/projects/aucoin/aucoin-screenshot-1.png" --width=1920 --height=1080
capture-website "https://aucoin.vercel.app/" --output="public/images/projects/aucoin/aucoin-screenshot-2.png" --width=1920 --height=1080 --full-page
capture-website "https://aucoin.vercel.app/" --output="public/images/projects/aucoin/aucoin-screenshot-3.png" --width=768 --height=1024 --emulate-device="iPad"
capture-website "https://aucoin.vercel.app/" --output="public/images/projects/aucoin/aucoin-screenshot-4.png" --width=390 --height=844 --emulate-device="iPhone 12"
capture-website "https://aucoin.vercel.app/" --output="public/images/projects/aucoin/aucoin-screenshot-5.png" --width=1920 --height=1080 --scroll-to-element="footer"

# MenonitApp
echo "Capturando MenonitApp..."
capture-website "https://menonitapp.com/" --output="public/images/projects/menonitapp/menonitapp-screenshot-1.png" --width=1920 --height=1080
capture-website "https://menonitapp.com/" --output="public/images/projects/menonitapp/menonitapp-screenshot-2.png" --width=1920 --height=1080 --full-page
capture-website "https://menonitapp.com/" --output="public/images/projects/menonitapp/menonitapp-screenshot-3.png" --width=768 --height=1024 --emulate-device="iPad"
capture-website "https://menonitapp.com/" --output="public/images/projects/menonitapp/menonitapp-screenshot-4.png" --width=390 --height=844 --emulate-device="iPhone 12"
capture-website "https://menonitapp.com/" --output="public/images/projects/menonitapp/menonitapp-screenshot-5.png" --width=1920 --height=1080 --scroll-to-element="footer"

echo "✅ Screenshots capturados exitosamente!"