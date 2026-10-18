import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

// Fix default marker icons (Vite doesn't bundle Leaflet's image URLs correctly by default)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STORAGE_KEY = 'memory-map-pins'
// Brooklyn, NY center
const BROOKLYN_CENTER = [40.6782, -73.9442]

function loadPins() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function savePins(pins) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pins))
}

const GOOGLE_MAPS_EMBED_KEY = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY

function StreetView({ lat, lng }) {
  const [open, setOpen] = useState(false)
  const streetViewUrl = `https://www.google.com/maps?layer=c&cbll=${lat},${lng}&cbp=0,0,0,0,0`

  return (
    <div className="street-view">
      <div className="street-view-actions">
        {GOOGLE_MAPS_EMBED_KEY && (
          <button
            type="button"
            className="btn-secondary btn-streetview"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Hide Street View' : '🧭 Street View'}
          </button>
        )}
        <a
          className="street-view-link"
          href={streetViewUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Google Street View ↗
        </a>
      </div>
      {GOOGLE_MAPS_EMBED_KEY && open && (
        <iframe
          className="street-view-frame"
          title="Street View"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_MAPS_EMBED_KEY}&location=${lat},${lng}&heading=0&pitch=0&fov=80`}
        />
      )}
    </div>
  )
}

function ClickCatcher({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng)
    },
  })
  return null
}

function PinForm({ draft, onSave, onCancel }) {
  const [title, setTitle] = useState('')
  const [when, setWhen] = useState('')
  const [memory, setMemory] = useState('')
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      id: Date.now(),
      lat: draft.lat,
      lng: draft.lng,
      title: title.trim(),
      when: when.trim(),
      memory: memory.trim(),
    })
  }

  return (
    <form className="pin-form" onSubmit={handleSubmit}>
      <h3>New memory</h3>
      <label>
        Title
        <input
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Prospect Park sledding hill"
          required
        />
      </label>
      <label>
        When
        <input
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          placeholder="e.g. 2010 or Winter 2008"
        />
      </label>
      <label>
        Story
        <textarea
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          placeholder="What happened here?"
          rows={4}
        />
      </label>
      <div className="pin-form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Save memory
        </button>
      </div>
    </form>
  )
}

export default function App() {
  const [pins, setPins] = useState(loadPins)
  const [draft, setDraft] = useState(null) // {lat, lng} while adding a new pin
  const [addMode, setAddMode] = useState(false)

  useEffect(() => {
    savePins(pins)
  }, [pins])

  function handleMapClick(latlng) {
    if (!addMode) return
    setDraft({ lat: latlng.lat, lng: latlng.lng })
  }

  function handleSave(pin) {
    setPins((prev) => [...prev, pin])
    setDraft(null)
    setAddMode(false)
  }

  function handleDelete(id) {
    if (!confirm('Delete this memory?')) return
    setPins((prev) => prev.filter((p) => p.id !== id))
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(pins, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'memory-map-pins.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-pin">📍</span>
          <span>Brooklyn Memory Map</span>
        </div>
        <div className="actions">
          <span className="pin-count">{pins.length} memor{pins.length === 1 ? 'y' : 'ies'}</span>
          {pins.length > 0 && (
            <button className="btn-secondary" onClick={handleExport}>
              Export JSON
            </button>
          )}
          <button
            className={addMode ? 'btn-primary active' : 'btn-primary'}
            onClick={() => {
              setAddMode((v) => !v)
              setDraft(null)
            }}
          >
            {addMode ? 'Click the map…' : '+ Add memory'}
          </button>
        </div>
      </header>

      <MapContainer
        center={BROOKLYN_CENTER}
        zoom={13}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCatcher onMapClick={handleMapClick} />

        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup minWidth={260} maxWidth={320}>
              <div className="popup-content">
                <h3>{pin.title}</h3>
                {pin.when && <div className="popup-when">{pin.when}</div>}
                {pin.memory && <p>{pin.memory}</p>}
                <StreetView lat={pin.lat} lng={pin.lng} />
                <button className="btn-delete" onClick={() => handleDelete(pin.id)}>
                  Delete
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {draft && (
          <Marker position={[draft.lat, draft.lng]}>
            <Popup autoPan={true} closeOnClick={false} autoClose={false}>
              <PinForm
                draft={draft}
                onSave={handleSave}
                onCancel={() => {
                  setDraft(null)
                  setAddMode(false)
                }}
              />
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {addMode && !draft && (
        <div className="hint-banner">Click anywhere on the map to drop a pin</div>
      )}
    </div>
  )
}
