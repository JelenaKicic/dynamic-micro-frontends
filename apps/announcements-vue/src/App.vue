<script setup>
import { onMounted, ref } from 'vue'

const API = 'https://efee.etf.unibl.org:8443/api/public/oglasne-ploce/'

const boards = [
    { id: 1, name: 'Прва година' },
    { id: 2, name: 'Друга година' },
    { id: 3, name: 'Трећа година' },
    { id: 4, name: 'Четврта година' },
    { id: 21, name: 'Завршни радови' },
]

const activeBoard = ref(boards[0].id)
const announcements = ref([])
const loading = ref(false)
const error = ref(null)

const fetchAnnouncements = async (boardId) => {
    loading.value = true
    error.value = null
    try {
        const response = await fetch(API + boardId)
        announcements.value = await response.json()
    } catch (e) {
        error.value = 'Грешка при учитавању огласа.'
        announcements.value = []
    } finally {
        loading.value = false
    }
}

const selectBoard = (boardId) => {
    activeBoard.value = boardId
    fetchAnnouncements(boardId)
}

const formatDate = (value) => {
    if (!value) return ''
    return new Date(value).toLocaleDateString('sr-RS', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })
}

onMounted(() => {
    activeBoard.value = parseInt(localStorage.getItem('year')) || 1
    fetchAnnouncements(activeBoard.value)

    window.addEventListener('yearUpdated', (e) => {
        selectBoard(e.detail.detail.year)
    })
})
</script>

<template>
  <main class="announcements">
    <h1>Огласна плоча</h1>

    <nav class="tabs">
      <button
        v-for="board in boards"
        :key="board.id"
        class="tab"
        :class="{ active: board.id === activeBoard }"
        @click="selectBoard(board.id)"
      >
        {{ board.name }}
      </button>
    </nav>

    <p v-if="loading" class="state">Учитавање…</p>
    <p v-else-if="error" class="state error">{{ error }}</p>
    <p v-else-if="!announcements.length" class="state">Нема активних огласа.</p>

    <ul v-else class="list">
      <li v-for="item in announcements" :key="item.id" class="card">
        <div class="card-head">
          <h2>{{ item.naslov }}</h2>
          <span class="date">{{ formatDate(item.vrijemeKreiranja) }}</span>
        </div>
        <p v-if="item.uvod" class="intro">{{ item.uvod }}</p>
        <p class="content">{{ item.sadrzaj }}</p>
        <footer class="card-foot">
          <span v-if="item.potpis" class="signature">{{ item.potpis }}</span>
          <span class="expires">важи до {{ formatDate(item.vrijemeIsteka) }}</span>
        </footer>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.announcements {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 20px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1f2933;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 24px;
  color: #1d4ed8;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.tab {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #475569;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  border-color: #1d4ed8;
  color: #1d4ed8;
}

.tab.active {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}

.state {
  color: #64748b;
  font-size: 15px;
}

.state.error {
  color: #dc2626;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #1d4ed8;
  border-radius: 8px;
  padding: 18px 20px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 8px;
}

.card-head h2 {
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}

.date {
  font-size: 13px;
  color: #94a3b8;
  white-space: nowrap;
}

.intro {
  font-style: italic;
  color: #475569;
  margin: 0 0 6px;
}

.content {
  margin: 0;
  line-height: 1.55;
  color: #334155;
  white-space: pre-line;
}

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  font-size: 13px;
  color: #64748b;
}

.signature {
  font-weight: 500;
}

.expires {
  color: #94a3b8;
}
</style>
