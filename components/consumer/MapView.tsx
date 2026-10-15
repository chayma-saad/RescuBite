"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { formatCurrency, discountPercent, timeUntil } from "@/lib/utils";

// Fix default marker icons in Next.js
const createIcon = (color: string) => L.divIcon({
  html: `<div style="width:30px;height:30px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>`,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -35],
});

const saleIcon = createIcon("#E07856");
const donationIcon = createIcon("#4A7C4E");

interface Bag {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  remainingQty: number;
  pickupEnd: string;
  type: string;
  restaurant: { name: string; lat: number; lng: number; address: string };
}

function MapCenter({ bags }: { bags: Bag[] }) {
  const map = useMap();
  useEffect(() => {
    if (bags.length > 0) {
      const bounds = L.latLngBounds(bags.map((b) => [b.restaurant.lat, b.restaurant.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bags, map]);
  return null;
}

export default function MapView({ bags }: { bags: Bag[] }) {
  const center: [number, number] = [36.8065, 10.1815];

  return (
    <MapContainer center={center} zoom={12} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapCenter bags={bags} />
      {bags.map((bag) => (
        <Marker
          key={bag.id}
          position={[bag.restaurant.lat, bag.restaurant.lng]}
          icon={bag.type === "DONATION" ? donationIcon : saleIcon}
        >
          <Popup maxWidth={220}>
            <div style={{ fontFamily: "Inter, sans-serif", padding: "4px 0" }}>
              <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px", color: "#2A2A2A" }}>{bag.restaurant.name}</p>
              <p style={{ fontSize: "12px", color: "#6B6B6B", marginBottom: "6px" }}>{bag.title}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                {bag.type === "DONATION" ? (
                  <span style={{ fontWeight: 700, color: "#4A7C4E" }}>❤️ Free Donation</span>
                ) : (
                  <div>
                    <span style={{ fontWeight: 700, color: "#3D5A3D", fontSize: "16px" }}>{formatCurrency(bag.discountedPrice)}</span>
                    <span style={{ fontSize: "11px", color: "#6B6B6B", marginLeft: "6px", textDecoration: "line-through" }}>{formatCurrency(bag.originalPrice)}</span>
                  </div>
                )}
                <span style={{ fontSize: "11px", color: "#6B6B6B" }}>{bag.remainingQty} left</span>
              </div>
              <p style={{ fontSize: "11px", color: "#6B6B6B", marginBottom: "8px" }}>⏰ Until {timeUntil(bag.pickupEnd)}</p>
              <a
                href={`/bag/${bag.id}`}
                style={{
                  display: "block", textAlign: "center", padding: "8px",
                  background: bag.type === "DONATION" ? "#4A7C4E" : "#E07856",
                  color: "white", borderRadius: "8px", fontSize: "12px",
                  fontWeight: 600, textDecoration: "none",
                }}
              >
                {bag.type === "DONATION" ? "Claim Donation" : "Reserve Now"}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
