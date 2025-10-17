<template>
  <DashboardLayout :header="headerConfig">
    <DashboardCard title="좌석 배치" intent="default">
      <div class="seat-layout-editor">
        <div class="editor-header">
          <div class="toolbar">
            <input
              ref="fileInput"
              type="file"
              accept=".svg"
              style="display: none"
              @change="handleFileImport"
            />
            <button class="tool-btn import" @click="importSvg">SVG 도면도 가져오기</button>
            <button class="tool-btn" @click="getAllUsers">모든 사용자 조회 테스트</button>
            <button :class="{ active: isAddMode }" class="tool-btn" @click="toggleAddMode">
              {{ isAddMode ? '편집 모드' : '좌석 추가' }}
            </button>
            <button class="tool-btn danger" @click="clearSeats">모든 좌석 삭제</button>
            <button class="tool-btn export" @click="exportLayout">내보내기</button>
            <button class="tool-btn reset" @click="resetAllData">데이터 초기화</button>
          </div>
        </div>

        <div class="editor-content">
          <div
            ref="svgContainer"
            class="svg-container"
            :class="{ 'add-mode': isAddMode }"
            @click="handleContainerClick"
          >
            <div v-if="svgContent" class="svg-wrapper">
              <div class="base-svg" v-html="svgContent"></div>

              <!-- 좌석 박스들 -->
              <div
                v-for="seat in seats"
                :key="seat.id"
                class="seat-box"
                :style="{
                  left: seat.x + 'px',
                  top: seat.y + 'px',
                  width: seat.width + 'px',
                  height: seat.height + 'px',
                  ...getSeatStyle(seat)
                }"
                :class="{
                  selected: selectedSeat && selectedSeat.id === seat.id,
                  dragging: draggingSeat && draggingSeat.id === seat.id
                }"
                @click.stop="selectSeat(seat)"
                @mousedown="startDrag(seat, $event)"
              >
                <div class="seat-label">{{ seat.label }}</div>
                <div class="resize-handle" @mousedown.stop="startResize(seat, $event)"></div>
              </div>
            </div>

            <div v-else class="empty-state">
              <p>SVG 도면도를 먼저 가져와주세요.</p>
            </div>
          </div>

          <div v-if="selectedSeat" class="properties-panel">
            <h3>좌석 속성</h3>
            <div class="property-group">
              <label>라벨:</label>
              <input v-model="selectedSeat.label" type="text" class="property-input" />
            </div>
            <div class="property-group">
              <label>너비:</label>
              <input
                v-model.number="selectedSeat.width"
                type="number"
                class="property-input"
                min="20"
              />
            </div>
            <div class="property-group">
              <label>높이:</label>
              <input
                v-model.number="selectedSeat.height"
                type="number"
                class="property-input"
                min="20"
              />
            </div>
            <div class="property-group">
              <label>X 위치:</label>
              <input v-model.number="selectedSeat.x" type="number" class="property-input" />
            </div>
            <div class="property-group">
              <label>Y 위치:</label>
              <input v-model.number="selectedSeat.y" type="number" class="property-input" />
            </div>
            <div class="property-group">
              <label>좌석 색상:</label>
              <select v-model="selectedSeat.color" class="property-input">
                <option value="blue">파란색 (기본)</option>
                <option value="green">초록색</option>
                <option value="red">빨간색</option>
                <option value="purple">보라색</option>
                <option value="orange">주황색</option>
              </select>
            </div>
            <div class="property-group">
              <label>좌석 타입:</label>
              <select v-model="selectedSeat.type" class="property-input">
                <option value="normal">일반 좌석</option>
              </select>
            </div>
            <button class="delete-btn" @click="deleteSeat">좌석 삭제</button>
          </div>
        </div>
      </div>
    </DashboardCard>
  </DashboardLayout>
</template>
<script>
import seatLogic from '../services/seat.js'
export default seatLogic
</script>

<script setup>
import DashboardLayout from '../components/ui/DashboardLayout.vue'
import DashboardCard from '../components/ui/DashboardCard.vue'
import { MapPin } from 'lucide-vue-next'

const headerConfig = {
  title: '좌석 배치',
  description: '좌석 배치도 편집기',
  icon: MapPin
}
</script>

<style scoped>
@import '../assets/css/seat.css';
</style>
