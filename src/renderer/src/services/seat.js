export default {
  name: 'SeatLayoutEditor',
  data() {
    return {
      seats: [],
      selectedSeat: null,
      isAddMode: false,
      draggingSeat: null,
      resizingSeat: null,
      dragOffset: { x: 0, y: 0 },
      seatCounter: 1,
      svgContent: ''
    }
  },
  mounted() {
    this.loadFromStorage()
  },
  watch: {
    seats: {
      handler() {
        this.saveToStorage()
      },
      deep: true
    },
    svgContent() {
      this.saveToStorage()
    }
  },
  methods: {
    saveToStorage() {
      const data = {
        seats: this.seats,
        svgContent: this.svgContent,
        seatCounter: this.seatCounter
      }
      localStorage.setItem('seatLayoutEditor', JSON.stringify(data))
    },
    loadFromStorage() {
      try {
        const saved = localStorage.getItem('seatLayoutEditor')
        if (saved) {
          const data = JSON.parse(saved)
          this.seats = data.seats || []
          this.svgContent = data.svgContent || ''
          this.seatCounter = data.seatCounter || 1
        }
      } catch (error) {
        console.error('저장된 데이터 로드 오류:', error)
      }
    },
    clearStorage() {
      localStorage.removeItem('seatLayoutEditor')
      this.seats = []
      this.svgContent = ''
      this.selectedSeat = null
      this.seatCounter = 1
    },
    importSvg() {
      this.$refs.fileInput.click()
    },
    handleFileImport(event) {
      const file = event.target.files[0]
      if (!file) return
      if (!file.name.toLowerCase().endsWith('.svg')) {
        alert('SVG 파일만 선택할 수 있습니다.')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const svgContent = e.target.result
          this.loadSvgToEditor(svgContent)
        } catch (error) {
          console.error('SVG 파일 읽기 오류:', error)
          alert('SVG 파일을 읽는 중 오류가 발생했습니다.')
        }
      }
      reader.readAsText(file)
    },
    loadSvgToEditor(svgContent) {
      this.svgContent = svgContent
      if (confirm('새로운 SVG를 가져오면 기존 좌석들이 삭제됩니다. 계속하시겠습니까?')) {
        this.seats = []
        this.selectedSeat = null
        this.seatCounter = 1
      }
      this.$refs.fileInput.value = ''
    },
    toggleAddMode() {
      this.isAddMode = !this.isAddMode
      this.selectedSeat = null
    },
    handleContainerClick(event) {
      if (this.isAddMode) {
        this.addSeat(event)
      } else {
        this.selectedSeat = null
      }
    },
    addSeat(event) {
      const rect = this.$refs.svgContainer.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const newSeat = {
        id: Date.now(),
        x: x - 25,
        y: y - 15,
        width: 50,
        height: 30,
        label: `S${this.seatCounter++}`,
        color: 'blue',
        type: 'normal'
      }
      this.seats.push(newSeat)
      this.selectedSeat = newSeat
    },
    selectSeat(seat) {
      this.selectedSeat = seat
    },

    startDrag(seat, event) {
      if (this.isAddMode) return

      this.draggingSeat = seat
      this.selectedSeat = seat

      const rect = this.$refs.svgContainer.getBoundingClientRect()
      this.dragOffset = {
        x: event.clientX - rect.left - seat.x,
        y: event.clientY - rect.top - seat.y
      }
      document.addEventListener('mousemove', this.handleDrag)
      document.addEventListener('mouseup', this.stopDrag)
    },
    handleDrag(event) {
      if (!this.draggingSeat) return
      const rect = this.$refs.svgContainer.getBoundingClientRect()
      this.draggingSeat.x = event.clientX - rect.left - this.dragOffset.x
      this.draggingSeat.y = event.clientY - rect.top - this.dragOffset.y
    },
    stopDrag() {
      this.draggingSeat = null
      document.removeEventListener('mousemove', this.handleDrag)
      document.removeEventListener('mouseup', this.stopDrag)
    },
    startResize(seat) {
      this.resizingSeat = seat
      this.selectedSeat = seat
      document.addEventListener('mousemove', this.handleResize)
      document.addEventListener('mouseup', this.stopResize)
    },
    handleResize(event) {
      if (!this.resizingSeat) return
      const rect = this.$refs.svgContainer.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      this.resizingSeat.width = Math.max(20, mouseX - this.resizingSeat.x)
      this.resizingSeat.height = Math.max(20, mouseY - this.resizingSeat.y)
    },
    stopResize() {
      this.resizingSeat = null
      document.removeEventListener('mousemove', this.handleResize)
      document.removeEventListener('mouseup', this.stopResize)
    },
    deleteSeat() {
      if (this.selectedSeat) {
        const index = this.seats.findIndex((seat) => seat.id === this.selectedSeat.id)
        if (index > -1) {
          this.seats.splice(index, 1)
          this.selectedSeat = null
        }
      }
    },
    getAllUsers() {
      window.api.getAllUsers().then((result) => {
        console.log(result)
      })
    },
    clearSeats() {
      if (confirm('모든 좌석을 삭제하시겠습니까?')) {
        this.seats = []
        this.selectedSeat = null
        this.seatCounter = 1
      }
    },
    exportLayout() {
      const layoutData = {
        svgContent: this.svgContent,
        seats: this.seats
      }
      const dataStr = JSON.stringify(layoutData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'seat-layout.json'
      link.click()
      URL.revokeObjectURL(url)
    },
    resetAllData() {
      if (
        confirm('모든 데이터(SVG, 좌석, 설정)를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
      ) {
        this.clearStorage()
      }
    },
    getSeatStyle(seat) {
      const colorMap = {
        blue: { background: 'rgba(0, 123, 255, 0.7)', border: '#007bff' },
        green: { background: 'rgba(40, 167, 69, 0.7)', border: '#28a745' },
        red: { background: 'rgba(220, 53, 69, 0.7)', border: '#dc3545' },
        purple: { background: 'rgba(111, 66, 193, 0.7)', border: '#6f42c1' },
        orange: { background: 'rgba(253, 126, 20, 0.7)', border: '#fd7e14' }
      }
      const typeMap = {
        normal: {},
        vip: {
          boxShadow: '0 0 10px rgba(255, 193, 7, 0.8)',
          fontWeight: 'bold'
        },
        disabled: {
          background: 'rgba(108, 117, 125, 0.7)',
          border: '#6c757d'
        },
        reserved: {
          background:
            'repeating-linear-gradient(45deg, rgba(0, 123, 255, 0.7), rgba(0, 123, 255, 0.7) 10px, rgba(255, 255, 255, 0.3) 10px, rgba(255, 255, 255, 0.3) 20px)'
        }
      }
      return {
        ...(colorMap[seat.color] || colorMap.blue),
        ...(typeMap[seat.type] || typeMap.normal)
      }
    }
  }
}
