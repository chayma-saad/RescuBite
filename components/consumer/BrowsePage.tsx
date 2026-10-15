"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Search, SlidersHorizontal, MapPin, Clock, ShoppingBag, Heart } from "lucide-react";
import { formatCurrency, timeUntil, discountPercent } from "@/lib/utils";
import Link from "next/link";

const MapView = dynamic(() => import("@/components/consumer/MapView"), { ssr: false });

interface Bag {
  id: string;
  title: string;
  description: string | null;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  remainingQty: number;
  status: string;
  type: string;
  pickupStart: string;
  pickupEnd: string;
  imageUrl: string | null;
  restaurant: {
    name: string;
    lat: number;
    lng: number;
    address: string;
    cuisine: string;
    imageUrl: string | null;
  };
}

const CUISINES = ["All", "Tunisian", "Mediterranean", "Maghrebi", "International", "Tunisian Street Food"];

function BagCard({ bag }: { bag: Bag }) {
  const discount = discountPercent(bag.originalPrice, bag.discountedPrice);
  const urgent = new Date(bag.pickupEnd).getTime() - Date.now() < 45 * 60 * 1000;
  const isDonation = bag.type === "DONATION";

  return (
    <Link href={`/bag/${bag.id}`} className="card group hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative h-40 overflow-hidden" style={{ background: "var(--color-bg)" }}>
        {bag.imageUrl || bag.restaurant.imageUrl ? (
          <img
            src={bag.imageUrl ?? bag.restaurant.imageUrl ?? ""}
            alt={bag.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🥘</div>
        )}
        <div className="absolute top-2 right-2">
          {isDonation ? (
            <span className="badge badge-green px-2 py-1">❤️ Free Donation</span>
          ) : (
            <span className="badge badge-orange px-2 py-1">{discount}% off</span>
          )}
        </div>
        {urgent && (
          <div className="absolute bottom-2 left-2">
            <span className="badge badge-red px-2 py-1 timer-urgent">⚡ Ending soon</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm leading-snug" style={{ color: "var(--color-text)" }}>{bag.title}</h3>
        </div>
        <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
          <MapPin size={10} className="inline mr-0.5" />{bag.restaurant.name}
        </p>
        {bag.description && (
          <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--color-text-secondary)" }}>{bag.description}</p>
        )}

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              {!isDonation && (
                <>
                  <span className="text-lg font-bold tabular-nums" style={{ color: "var(--color-primary)", fontFamily: "Fraunces, serif" }}>
                    {formatCurrency(bag.discountedPrice)}
                  </span>
                  <span className="text-xs line-through ml-2" style={{ color: "var(--color-text-secondary)" }}>{formatCurrency(bag.originalPrice)}</span>
                </>
              )}
            </div>
            <span className="text-xs font-medium" style={{ color: bag.remainingQty <= 2 ? "var(--color-danger)" : "var(--color-text-secondary)" }}>
              {bag.remainingQty} left
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
            <Clock size={11} />
            <span className={urgent ? "timer-urgent font-medium" : ""}>Pickup until {timeUntil(bag.pickupEnd)}</span>
          </div>
        </div>
      </div>

      {/* Reserve button */}
      <div className="px-4 pb-4">
        <div className={`w-full text-center py-2 rounded-lg text-sm font-medium transition-all ${isDonation ? "text-white" : "text-white"}`}
          style={{ background: isDonation ? "#4A7C4E" : "var(--color-accent)" }}>
          {isDonation ? <><Heart size={13} className="inline mr-1" />Claim Donation</> : <><ShoppingBag size={13} className="inline mr-1" />Reserve Now</>}
        </div>
      </div>
    </Link>
  );
}

export function BrowsePage({ bags }: { bags: Bag[] }) {
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [showMap, setShowMap] = useState(false);
  const [showDonations, setShowDonations] = useState(false);

  const filtered = useMemo(() => {
    return bags.filter((b) => {
      const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.restaurant.name.toLowerCase().includes(search.toLowerCase());
      const matchCuisine = cuisine === "All" || b.restaurant.cuisine === cuisine;
      const matchDonation = !showDonations || b.type === "DONATION";
      return matchSearch && matchCuisine && matchDonation;
    });
  }, [bags, search, cuisine, showDonations]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>Rescue Bags Near You</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          {bags.length} bags available right now across Tunis
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-secondary)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurant or bag..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:outline-none"
            style={{ borderColor: "var(--color-border)", background: "white" }}
          />
        </div>
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm focus:outline-none"
          style={{ borderColor: "var(--color-border)", background: "white" }}
        >
          {CUISINES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button
          onClick={() => setShowDonations(!showDonations)}
          className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
          style={{
            borderColor: showDonations ? "#4A7C4E" : "var(--color-border)",
            background: showDonations ? "#e6f4e7" : "white",
            color: showDonations ? "#2e6b32" : "var(--color-text)",
          }}
        >
          ❤️ Donations only
        </button>
        <button
          onClick={() => setShowMap(!showMap)}
          className="px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
          style={{
            borderColor: showMap ? "var(--color-primary)" : "var(--color-border)",
            background: showMap ? "#3D5A3D18" : "white",
            color: showMap ? "var(--color-primary)" : "var(--color-text)",
          }}
        >
          <MapPin size={13} className="inline mr-1" />{showMap ? "Hide" : "Show"} Map
        </button>
      </div>

      {/* Map */}
      {showMap && (
        <div className="mb-6 rounded-2xl overflow-hidden" style={{ height: 380 }}>
          <MapView bags={filtered} />
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: "var(--color-text-secondary)" }} />
          <p className="font-medium text-lg mb-2" style={{ fontFamily: "Fraunces, serif", color: "var(--color-text)" }}>No bags available</p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Check back later — restaurants post new bags throughout the day.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((bag) => <BagCard key={bag.id} bag={bag} />)}
        </div>
      )}

      {/* Pay at pickup note */}
      <div className="mt-8 p-4 rounded-xl text-center" style={{ background: "#e6f4e7" }}>
        <p className="text-sm font-medium" style={{ color: "#2e6b32" }}>💳 All purchases are <strong>Pay at Pickup</strong> — no card required to reserve.</p>
      </div>
    </div>
  );
}
